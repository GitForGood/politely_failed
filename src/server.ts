import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import messageRoutes from './routes/messages';
import { getMessageService } from './services/messageService';
import { getMessageLoader } from './utils/messageLoader';

/**
 * Create and configure the Express application
 */
export function createServer(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors());

  // Compression middleware
  app.use(compression());

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize message loader
  try {
    const loader = getMessageLoader();
    loader.loadMessages();
    console.log('Messages loaded successfully');
  } catch (error) {
    console.error('Failed to load messages:', error);
    process.exit(1);
  }

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    try {
      const messageService = getMessageService();
      res.json({
        status: 'ok',
        version: messageService.getVersion(),
        messagesLoaded: messageService.getMessageCount(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Categories endpoint
  app.get('/api/v1/categories', (req: Request, res: Response) => {
    try {
      const messageService = getMessageService();
      res.json({
        categories: messageService.getCategories(),
        tones: messageService.getTones(),
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // API routes
  app.use('/api/v1/messages', messageRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}

export default createServer;

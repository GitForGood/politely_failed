import dotenv from 'dotenv';
import { createServer } from './server';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create the Express application
const app = createServer();

// Start the server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Politely Failed API is running!`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📚 API Base: http://localhost:${PORT}/api/v1`);
  console.log(`\nExample request:`);
  console.log(`  curl "http://localhost:${PORT}/api/v1/messages/random?category=network&tone=humorous"\n`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

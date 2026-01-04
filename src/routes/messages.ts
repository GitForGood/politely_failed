import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { getMessageService } from '../services/messageService';
import { Category, Tone } from '../models/types';

const router = Router();
const messageService = getMessageService();

/**
 * GET /messages/random
 * Get a random message for the specified category and tone
 */
router.get(
  '/random',
  [
    query('category')
      .notEmpty()
      .withMessage('Category is required')
      .custom((value) => messageService.isValidCategory(value))
      .withMessage('Invalid category'),
    query('tone')
      .notEmpty()
      .withMessage('Tone is required')
      .custom((value) => messageService.isValidTone(value))
      .withMessage('Invalid tone'),
    query('format')
      .optional()
      .isIn(['json', 'text'])
      .withMessage('Format must be either json or text'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg,
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const category = req.query.category as Category;
      const tone = req.query.tone as Tone;
      const format = (req.query.format as string) || 'json';

      const message = messageService.getRandomMessage(category, tone);

      if (format === 'text') {
        return res.type('text/plain').send(message);
      }

      return res.json({
        message,
        category,
        tone,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * GET /messages
 * Get all messages for the specified category and tone
 */
router.get(
  '/',
  [
    query('category')
      .notEmpty()
      .withMessage('Category is required')
      .custom((value) => messageService.isValidCategory(value))
      .withMessage('Invalid category'),
    query('tone')
      .notEmpty()
      .withMessage('Tone is required')
      .custom((value) => messageService.isValidTone(value))
      .withMessage('Invalid tone'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: errors.array()[0].msg,
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const category = req.query.category as Category;
      const tone = req.query.tone as Tone;

      const messages = messageService.getAllMessages(category, tone);

      return res.json({
        category,
        tone,
        messages,
        count: messages.length,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
);

export default router;

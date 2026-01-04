// Type definitions for the politely_failed service

export enum Category {
  NETWORK = 'network',
  AUTH = 'auth',
  DATABASE = 'database',
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  NOT_IMPLEMENTED = 'not_implemented',
}

export enum Tone {
  CASUAL = 'casual',
  PROFESSIONAL = 'professional',
  HUMOROUS = 'humorous',
}

export type Message = string;

export interface ToneMessages {
  casual: Message[];
  professional: Message[];
  humorous: Message[];
}

export interface CategoryMessages {
  [Category.NETWORK]: ToneMessages;
  [Category.AUTH]: ToneMessages;
  [Category.DATABASE]: ToneMessages;
  [Category.VALIDATION]: ToneMessages;
  [Category.RATE_LIMIT]: ToneMessages;
  [Category.SERVER_ERROR]: ToneMessages;
  [Category.NOT_IMPLEMENTED]: ToneMessages;
}

export interface MessageDatabase {
  version: string;
  categories: CategoryMessages;
}

// API Response types
export interface RandomMessageResponse {
  message: string;
  category: string;
  tone: string;
  timestamp: string;
}

export interface AllMessagesResponse {
  category: string;
  tone: string;
  messages: string[];
  count: number;
}

export interface CategoriesResponse {
  categories: string[];
  tones: string[];
}

export interface HealthResponse {
  status: string;
  version: string;
  messagesLoaded: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}

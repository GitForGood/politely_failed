import { getMessageLoader } from '../utils/messageLoader';
import { Category, Tone, Message } from '../models/types';

/**
 * Service class for managing and retrieving error messages
 */
export class MessageService {
  /**
   * Get a random message for the specified category and tone
   */
  public getRandomMessage(category: Category, tone: Tone): Message {
    const loader = getMessageLoader();
    const db = loader.getDatabase();

    const messages = db.categories[category][tone];

    if (!messages || messages.length === 0) {
      throw new Error(`No messages found for category: ${category}, tone: ${tone}`);
    }

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  /**
   * Get all messages for the specified category and tone
   */
  public getAllMessages(category: Category, tone: Tone): Message[] {
    const loader = getMessageLoader();
    const db = loader.getDatabase();

    const messages = db.categories[category][tone];

    if (!messages) {
      throw new Error(`No messages found for category: ${category}, tone: ${tone}`);
    }

    return messages;
  }

  /**
   * Get all available categories
   */
  public getCategories(): string[] {
    return Object.values(Category);
  }

  /**
   * Get all available tones
   */
  public getTones(): string[] {
    return Object.values(Tone);
  }

  /**
   * Check if a category is valid
   */
  public isValidCategory(category: string): category is Category {
    return Object.values(Category).includes(category as Category);
  }

  /**
   * Check if a tone is valid
   */
  public isValidTone(tone: string): tone is Tone {
    return Object.values(Tone).includes(tone as Tone);
  }

  /**
   * Get the total number of messages loaded
   */
  public getMessageCount(): number {
    const loader = getMessageLoader();
    return loader.getMessageCount();
  }

  /**
   * Get the version of the message database
   */
  public getVersion(): string {
    const loader = getMessageLoader();
    const db = loader.getDatabase();
    return db.version;
  }
}

// Singleton instance
let serviceInstance: MessageService | null = null;

export function getMessageService(): MessageService {
  if (!serviceInstance) {
    serviceInstance = new MessageService();
  }
  return serviceInstance;
}

export default MessageService;

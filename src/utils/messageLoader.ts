import fs from 'fs';
import path from 'path';
import { MessageDatabase, Category, Tone } from '../models/types';

class MessageLoader {
  private messageDatabase: MessageDatabase | null = null;
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || process.env.MESSAGES_FILE_PATH || './data/messages.json';
  }

  /**
   * Load and parse the messages.json file
   * Caches the result in memory for subsequent calls
   */
  public loadMessages(): MessageDatabase {
    if (this.messageDatabase) {
      return this.messageDatabase;
    }

    try {
      const resolvedPath = path.resolve(this.filePath);

      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Messages file not found at: ${resolvedPath}`);
      }

      const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
      const parsedData = JSON.parse(fileContent) as MessageDatabase;

      // Validate the structure
      this.validateMessageDatabase(parsedData);

      this.messageDatabase = parsedData;
      return this.messageDatabase;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load messages: ${error.message}`);
      }
      throw new Error('Failed to load messages: Unknown error');
    }
  }

  /**
   * Validate that the message database has the correct structure
   */
  private validateMessageDatabase(data: any): void {
    if (!data.version) {
      throw new Error('Message database missing version field');
    }

    if (!data.categories || typeof data.categories !== 'object') {
      throw new Error('Message database missing categories field');
    }

    // Validate each category exists and has the required tones
    const requiredCategories = Object.values(Category);
    const requiredTones = Object.values(Tone);

    for (const category of requiredCategories) {
      if (!data.categories[category]) {
        throw new Error(`Missing category: ${category}`);
      }

      for (const tone of requiredTones) {
        if (!Array.isArray(data.categories[category][tone])) {
          throw new Error(`Category ${category} missing tone: ${tone}`);
        }

        if (data.categories[category][tone].length === 0) {
          console.warn(`Warning: Category ${category}, tone ${tone} has no messages`);
        }
      }
    }
  }

  /**
   * Get the cached message database
   */
  public getDatabase(): MessageDatabase {
    if (!this.messageDatabase) {
      return this.loadMessages();
    }
    return this.messageDatabase;
  }

  /**
   * Clear the cache and reload messages
   */
  public reload(): MessageDatabase {
    this.messageDatabase = null;
    return this.loadMessages();
  }

  /**
   * Get total number of messages loaded
   */
  public getMessageCount(): number {
    const db = this.getDatabase();
    let count = 0;

    for (const category of Object.values(Category)) {
      for (const tone of Object.values(Tone)) {
        count += db.categories[category][tone].length;
      }
    }

    return count;
  }
}

// Singleton instance
let loaderInstance: MessageLoader | null = null;

export function getMessageLoader(filePath?: string): MessageLoader {
  if (!loaderInstance) {
    loaderInstance = new MessageLoader(filePath);
  }
  return loaderInstance;
}

export default MessageLoader;

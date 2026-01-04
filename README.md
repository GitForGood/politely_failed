# Politely Failed

A self-hosted REST API service that provides humorous yet professional alternative error messages. Perfect for prototyping or when you need user-friendly failure messages instead of generic "not implemented" or technical error codes.

## Features

- **7 Error Categories**: network, auth, database, validation, rate_limit, server_error, not_implemented
- **3 Tone Options**: casual, professional, humorous
- **Easy to Customize**: All messages stored in an editable JSON file
- **REST API**: Simple HTTP endpoints for integration
- **TypeScript**: Full type safety and IntelliSense support
- **Self-Hosted**: Run it on your own machine

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd politely_failed

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Build the project
npm run build

# Start the server
npm start
```

### Development Mode

```bash
# Run with hot reload
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Get Random Message

Returns a random error message for the specified category and tone.

```bash
GET /messages/random?category=<category>&tone=<tone>&format=<format>
```

**Parameters:**
- `category` (required): One of: `network`, `auth`, `database`, `validation`, `rate_limit`, `server_error`, `not_implemented`
- `tone` (required): One of: `casual`, `professional`, `humorous`
- `format` (optional): `json` (default) or `text`

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/messages/random?category=network&tone=humorous"
```

**Example Response (JSON):**
```json
{
  "message": "The packets got lost on their way to the server. We suspect they stopped for snacks.",
  "category": "network",
  "tone": "humorous",
  "timestamp": "2026-01-04T12:00:00.000Z"
}
```

**Example Response (Text):**
```bash
curl "http://localhost:3000/api/v1/messages/random?category=network&tone=humorous&format=text"
# Returns: The packets got lost on their way to the server. We suspect they stopped for snacks.
```

#### 2. Get All Messages

Returns all messages for a specific category and tone combination.

```bash
GET /messages?category=<category>&tone=<tone>
```

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/messages?category=auth&tone=casual"
```

**Example Response:**
```json
{
  "category": "auth",
  "tone": "casual",
  "messages": [
    "Hmm, we couldn't verify that's really you. Mind checking your credentials?",
    "Access denied! But in a friendly way. Let's try logging in again?",
    "Your session seems to have wandered off. Time for a fresh login!"
  ],
  "count": 3
}
```

#### 3. List Categories

Returns all available categories and tones.

```bash
GET /categories
```

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/categories"
```

**Example Response:**
```json
{
  "categories": [
    "network",
    "auth",
    "database",
    "validation",
    "rate_limit",
    "server_error",
    "not_implemented"
  ],
  "tones": [
    "casual",
    "professional",
    "humorous"
  ]
}
```

#### 4. Health Check

Check if the service is running and see how many messages are loaded.

```bash
GET /health
```

**Example Request:**
```bash
curl "http://localhost:3000/health"
```

**Example Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "messagesLoaded": 105
}
```

## Message Categories

### network
Connection issues, timeouts, network unavailability

### auth
Authentication failures, session expiration, unauthorized access

### database
Database connection issues, query failures, data persistence problems

### validation
Input validation errors, format issues, invalid data

### rate_limit
Too many requests, quota exceeded

### server_error
Internal server errors, unexpected conditions (500 errors)

### not_implemented
Features under development, unimplemented functionality

## Customizing Messages

All messages are stored in `data/messages.json`. You can easily add, remove, or modify messages:

```json
{
  "version": "1.0.0",
  "categories": {
    "network": {
      "casual": [
        "Add your custom casual message here",
        "Another casual message"
      ],
      "professional": [
        "Add professional messages here"
      ],
      "humorous": [
        "Add funny messages here"
      ]
    }
  }
}
```

After editing the file, restart the server to load the new messages.

## Integration Examples

### JavaScript/TypeScript

```javascript
async function getErrorMessage(category, tone) {
  const response = await fetch(
    `http://localhost:3000/api/v1/messages/random?category=${category}&tone=${tone}`
  );
  const data = await response.json();
  return data.message;
}

// Usage
const message = await getErrorMessage('network', 'humorous');
console.log(message);
```

### Python

```python
import requests

def get_error_message(category, tone):
    response = requests.get(
        f'http://localhost:3000/api/v1/messages/random',
        params={'category': category, 'tone': tone}
    )
    return response.json()['message']

# Usage
message = get_error_message('database', 'casual')
print(message)
```

### cURL

```bash
# Get a humorous network error
curl "http://localhost:3000/api/v1/messages/random?category=network&tone=humorous"

# Get text-only response
curl "http://localhost:3000/api/v1/messages/random?category=auth&tone=professional&format=text"
```

## Configuration

Environment variables can be set in a `.env` file:

```env
PORT=3000
NODE_ENV=development
MESSAGES_FILE_PATH=./data/messages.json
LOG_LEVEL=info
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run lint` - Lint the code
- `npm run format` - Format code with Prettier

## Project Structure

```
politely_failed/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # Express app configuration
│   ├── models/
│   │   └── types.ts          # TypeScript type definitions
│   ├── routes/
│   │   └── messages.ts       # API route handlers
│   ├── services/
│   │   └── messageService.ts # Business logic
│   └── utils/
│       └── messageLoader.ts  # JSON file loader
├── data/
│   └── messages.json         # Message database
├── tests/                    # Test files
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Validation Error",
  "message": "Category is required",
  "timestamp": "2026-01-04T12:00:00.000Z"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Invalid parameters
- `404` - Endpoint not found
- `500` - Internal server error

## Contributing

Feel free to add more creative error messages! Edit `data/messages.json` and submit a pull request.

## License

GPL-3.0 - See LICENSE file for details

## Why This Exists

Because "Error 500: Internal Server Error" is boring, and your users deserve better. Sometimes a little humor (or professionalism, or casual friendliness) can turn a frustrating error into a smile.

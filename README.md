# AtlasCleanAI-Enterprise
AI-powered enterprise cleaning management platform with Customer, Cleaner and Management applications, intelligent scheduling, payments, workforce management and Atlas AI.

## Atlas AI — ChatGPT Integration

Atlas AI is the intelligent assistant embedded in AtlasCleanAI Enterprise, powered by the OpenAI ChatGPT API (GPT-4o by default).

### Features
- Real-time chat with Atlas, your enterprise cleaning AI assistant
- Streaming responses (SSE) via `/api/chat/stream`
- Conversation history preserved within a session
- Optional API key authentication for multi-tenant deployments

### Setup

1. **Install Node.js 22 or newer**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your OPENAI_API_KEY
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to chat with Atlas.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Send messages, receive full reply |
| `POST` | `/api/chat/stream` | Send messages, receive SSE stream |

#### Chat request body
```json
{
  "messages": [
    { "role": "user", "content": "How do I reschedule a cleaning job?" }
  ]
}
```

#### Authentication (optional)
Set `ATLAS_API_KEY` in `.env` and include the header `x-api-key: <key>` on all `/api/chat` requests. The browser UI has a memory-only API key field for this mode; it does not persist the key.

Chat requests accept at most 20 messages, 4,000 characters per message, and 16,000 characters in total.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ | — | Your OpenAI API key |
| `OPENAI_MODEL` | | `gpt-4o` | OpenAI model to use |
| `PORT` | | `3000` | HTTP server port |
| `NODE_ENV` | | `development` | Runtime environment |
| `ATLAS_API_KEY` | | — | Enables API key auth when set |

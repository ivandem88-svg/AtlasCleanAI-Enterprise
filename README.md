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

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your OPENAI_API_KEY
   ```

3. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to chat with Atlas.

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
Set `ATLAS_API_KEY` in `.env` and include the header `x-api-key: <key>` on all `/api/chat` requests.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ | — | Your OpenAI API key |
| `OPENAI_MODEL` | | `gpt-4o` | OpenAI model to use |
| `PORT` | | `3000` | HTTP server port |
| `ATLAS_API_KEY` | | — | Enables API key auth when set |

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { apiKeyAuth } = require('./src/middleware/auth');
const chatRouter = require('./src/routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ai: 'Atlas (ChatGPT)' }));

// Atlas AI chat endpoints (protected)
app.use('/api/chat', apiKeyAuth, chatRouter);

// Fallback: serve the frontend for any non-API route
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`AtlasCleanAI Enterprise running on http://localhost:${PORT}`);
  console.log(`Atlas AI model: ${process.env.OPENAI_MODEL || 'gpt-4o'}`);
});

module.exports = app;

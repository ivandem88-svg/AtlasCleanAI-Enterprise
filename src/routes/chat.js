const express = require('express');
const atlasAI = require('../services/atlasAI');

const router = express.Router();

/**
 * POST /api/chat
 * Body: { messages: [{role, content}, ...] }
 * Returns: { reply, usage }
 */
router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  const valid = messages.every(
    (m) =>
      m &&
      typeof m === 'object' &&
      ['user', 'assistant'].includes(m.role) &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0
  );

  if (!valid) {
    return res.status(400).json({
      error: 'Each message must have role ("user" or "assistant") and non-empty content string',
    });
  }

  try {
    const result = await atlasAI.chat(messages);
    return res.json(result);
  } catch (err) {
    console.error('Atlas AI error:', err.message);
    return res.status(502).json({ error: 'Atlas AI is unavailable. Please try again later.' });
  }
});

/**
 * POST /api/chat/stream
 * Body: { messages: [{role, content}, ...] }
 * Returns: text/event-stream (SSE)
 */
router.post('/stream', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  const valid = messages.every(
    (m) =>
      m &&
      typeof m === 'object' &&
      ['user', 'assistant'].includes(m.role) &&
      typeof m.content === 'string' &&
      m.content.trim().length > 0
  );

  if (!valid) {
    return res.status(400).json({
      error: 'Each message must have role ("user" or "assistant") and non-empty content string',
    });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    await atlasAI.chatStream(messages, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Atlas AI stream error:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
    res.end();
  }
});

module.exports = router;

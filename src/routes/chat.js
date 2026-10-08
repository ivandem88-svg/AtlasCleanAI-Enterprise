const express = require('express');
const atlasAI = require('../services/atlasAI');
const { validateMessages } = require('../validation/chat');

const router = express.Router();

/**
 * POST /api/chat
 * Body: { messages: [{role, content}, ...] }
 * Returns: { reply, usage }
 */
router.post('/', async (req, res) => {
  const validationError = validateMessages(req.body?.messages);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!atlasAI.isConfigured()) {
    return res.status(503).json({ error: 'Atlas AI is not configured.' });
  }

  try {
    const result = await atlasAI.chat(req.body.messages);
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
  const validationError = validateMessages(req.body?.messages);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (!atlasAI.isConfigured()) {
    return res.status(503).json({ error: 'Atlas AI is not configured.' });
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const abortController = new AbortController();
  const abortStream = () => abortController.abort();
  const abortIfUnfinished = () => {
    if (!res.writableEnded) {
      abortStream();
    }
  };
  req.on('aborted', abortStream);
  res.on('close', abortIfUnfinished);

  try {
    await atlasAI.chatStream(req.body.messages, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }, abortController.signal);
    if (!res.writableEnded) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (err) {
    if (abortController.signal.aborted) {
      return;
    }
    console.error('Atlas AI stream error:', err.message);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  } finally {
    req.off('aborted', abortStream);
    res.off('close', abortIfUnfinished);
  }
});

module.exports = router;

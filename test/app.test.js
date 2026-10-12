const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.OPENAI_API_KEY = '';
process.env.ATLAS_API_KEY = '';

const app = require('../server');
const { MAX_MESSAGES, validateMessages } = require('../src/validation/chat');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('health reports a degraded service when OpenAI is not configured', async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    status: 'degraded',
    ai: 'Atlas (ChatGPT)',
    configured: false,
  });
});

test('chat validates malformed requests before calling the provider', async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [] }),
  });

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'messages must be a non-empty array');
});

test('chat requires the configured API key before accepting a request', async () => {
  process.env.ATLAS_API_KEY = 'test-api-key';

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
  });

  assert.equal(response.status, 401);
  process.env.ATLAS_API_KEY = '';
});

test('chat validation limits conversation size', () => {
  const messages = Array.from({ length: MAX_MESSAGES + 1 }, () => ({
    role: 'user',
    content: 'hello',
  }));

  assert.equal(
    validateMessages(messages),
    `messages must contain at most ${MAX_MESSAGES} entries`
  );
});

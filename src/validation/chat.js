const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_CONTENT_LENGTH = 16000;

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'messages must be a non-empty array';
  }
  if (messages.length > MAX_MESSAGES) {
    return `messages must contain at most ${MAX_MESSAGES} entries`;
  }

  let totalContentLength = 0;
  const valid = messages.every((message) => {
    if (
      !message ||
      typeof message !== 'object' ||
      !['user', 'assistant'].includes(message.role) ||
      typeof message.content !== 'string' ||
      message.content.trim().length === 0 ||
      message.content.length > MAX_MESSAGE_LENGTH
    ) {
      return false;
    }
    totalContentLength += message.content.length;
    return totalContentLength <= MAX_TOTAL_CONTENT_LENGTH;
  });

  if (!valid) {
    return `Each message must have role ("user" or "assistant"), non-empty content, and at most ${MAX_MESSAGE_LENGTH} characters; total content must not exceed ${MAX_TOTAL_CONTENT_LENGTH} characters`;
  }
  return null;
}

module.exports = {
  MAX_MESSAGES,
  MAX_MESSAGE_LENGTH,
  MAX_TOTAL_CONTENT_LENGTH,
  validateMessages,
};

const OpenAI = require('openai');

const SYSTEM_PROMPT = `You are Atlas, the AI assistant for AtlasCleanAI Enterprise — an AI-powered enterprise cleaning management platform.

You help with:
- Scheduling and dispatching cleaning crews
- Workforce management and cleaner assignments
- Customer inquiries and service requests
- Payment and invoice questions
- Quality control and performance tracking
- Reporting and analytics

Be professional, concise, and solution-oriented. When you don't know something specific to the business, ask the user for more context.`;

class AtlasAIService {
  constructor() {
    this.model = process.env.OPENAI_MODEL || 'gpt-4o';
    this.client = null;
    this.clientApiKey = null;
  }

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY?.trim());
  }

  getClient() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    if (!this.client || this.clientApiKey !== apiKey) {
      this.client = new OpenAI({ apiKey });
      this.clientApiKey = apiKey;
    }
    return this.client;
  }

  /**
   * Send a message to Atlas AI and receive a response.
   * @param {Array<{role: string, content: string}>} messages - Conversation history
   * @returns {Promise<{reply: string, usage: object}>}
   */
  async chat(messages) {
    const response = await this.getClient().chat.completions.create({
      model: this.model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    });

    const choice = response.choices?.[0];
    const content = choice?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('OpenAI returned an empty response');
    }
    return {
      reply: content,
      usage: response.usage,
    };
  }

  /**
   * Stream a response from Atlas AI.
   * @param {Array<{role: string, content: string}>} messages - Conversation history
   * @param {function} onChunk - Callback invoked with each text chunk
   * @param {AbortSignal} signal - Signal used to cancel the upstream request.
   * @returns {Promise<void>}
   */
  async chatStream(messages, onChunk, signal) {
    const stream = await this.getClient().chat.completions.create(
      {
        model: this.model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      },
      { signal }
    );

    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content ?? '';
      if (text) onChunk(text);
    }
  }
}

module.exports = new AtlasAIService();

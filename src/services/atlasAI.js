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
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o';
  }

  /**
   * Send a message to Atlas AI and receive a response.
   * @param {Array<{role: string, content: string}>} messages - Conversation history
   * @returns {Promise<{reply: string, usage: object}>}
   */
  async chat(messages) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    });

    const choice = response.choices?.[0];
    if (!choice) {
      throw new Error('OpenAI returned an empty response');
    }
    return {
      reply: choice.message.content,
      usage: response.usage,
    };
  }

  /**
   * Stream a response from Atlas AI.
   * @param {Array<{role: string, content: string}>} messages - Conversation history
   * @param {function} onChunk - Callback invoked with each text chunk
   * @returns {Promise<void>}
   */
  async chatStream(messages, onChunk) {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? '';
      if (text) onChunk(text);
    }
  }
}

module.exports = new AtlasAIService();

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';

export class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async createThread(): Promise<string> {
    const thread = await this.openai.beta.threads.create();
    return thread.id;
  }

  async sendMessage(threadId: string, content: string): Promise<void> {
    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content,
    });
  }

  async createRun(threadId: string, assistantId: string, instructions: string) {
    return this.openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      additional_instructions: instructions,
    });
  }

  async getRunStatus(threadId: string, runId: string) {
    return this.openai.beta.threads.runs.retrieve(threadId, runId);
  }

  async getLastMessage(threadId: string): Promise<string> {
    const messages = await this.openai.beta.threads.messages.list(threadId, { limit: 1 });
    const contentBlock = messages.data[0]?.content[0];
    return contentBlock && 'text' in contentBlock ? contentBlock.text.value || '' : '';
  }

  async submitToolOutputs(threadId: string, runId: string, toolCalls: any[]): Promise<void> {
    const toolOutputs = toolCalls.map((tc) => ({ tool_call_id: tc.id, output: 'ok' }));
    await this.openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: toolOutputs,
    });
  }
}

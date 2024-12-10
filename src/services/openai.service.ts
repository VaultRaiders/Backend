import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';
import { RunnableToolFunction } from 'openai/lib/RunnableFunction';
import { ChatCompletionRunner } from 'openai/lib/ChatCompletionRunner';

import { ChatCompletionStreamingRunner } from 'openai/lib/ChatCompletionStreamingRunner';


const tools : RunnableToolFunction<any>[] = [
  {
    type: 'function',
    function: {
      name: 'approve',
      description: 'Approve user\'s transaction',
      parameters: {
        type: 'object',
        properties: {
          // genre: { type: 'string', enum: ['mystery', 'nonfiction', 'memoir', 'romance', 'historical'] },
        },
      },
      function: approve,
      parse: JSON.parse,
    },
  } as RunnableToolFunction<{}>,
  {
    type: 'function',
    function: {
      name: 'reject',
      description: 'Reject user\' transaction',
      parameters: {
        type: 'object',
        properties: {
          // genre: { type: 'string', enum: ['mystery', 'nonfiction', 'memoir', 'romance', 'historical'] },
        },
      },
      function: reject,
      parse: JSON.parse,
    },
  } as RunnableToolFunction<{  }>
]

async function approve() {
  return 'Your transaction has been approved'
}
async function reject() {
  return 'Your transaction has been rejected'
}


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
  // new
  async  sendMessageWithChatComplele(messages: any): Promise<ChatCompletionStreamingRunner>{
    const runner =  this.openai.beta.chat.completions.runTools({
      model: 'gpt-4o-mini',
      messages,
      tools,
      stream: true,
      store: true
    })
    return runner
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

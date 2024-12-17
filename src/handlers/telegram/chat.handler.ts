import { MyContext } from '../../util/interface';
import { BaseHandler } from './base.handler';
import { MINI_APP_URL } from '../../config';
import { Bot, Chat, ChatMessage, Ticket } from '../../infra/schema';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { botMessage, systemMessage } from '../../util/common';
import { ChatMessages } from '../../components/messages/chat.messages';
import { ErrorMessages } from '../../components/messages/error.messages';
import { createSubscriptionRequiredKeyboard } from '../../components/keyboards/chat.keyboards';
import { createOpenAppKeyboard } from '../../components/keyboards/main.keyboards';
import { BotMessages } from '../../components/messages/bot.messages';

export class ChatHandler extends BaseHandler {
  private readonly chatService = ChatService.getInstance();
  private readonly userService = UserService.getInstance();

  private async validateCurrentChat(ctx: MyContext): Promise<{bot: Bot, ticket: Ticket, chat: Chat} | undefined> {
    if (!ctx.message || !ctx.from) {
      await ctx.reply(systemMessage(ErrorMessages.connectionIssue));
      return;
    }

    const userId = ctx.from?.id.toString();
    const user = await this.userService.getOrCreateUser(userId, ctx.from?.username, ctx.chat?.id?.toString());
    if (!user) {
      await ctx.reply(systemMessage(ErrorMessages.profileMixup));
      return;
    }

    if (!user.currentBotId) {
      await ctx.reply(systemMessage(BotMessages.noBotSelected), createOpenAppKeyboard());
      return;
    }

    const bot = await this.botService.getBot(user.currentBotId);
    if (!bot) {
      return;
    }
    const ticket = await this.botService.getAvailableTicket(bot.id, user.id)

    if(!ticket) {
      await ctx.reply(systemMessage(ChatMessages.subscriptionRequired(bot.displayName)), {
        parse_mode: 'HTML',
        ...createSubscriptionRequiredKeyboard(),
      });
      return;
    }

    const chat = await this.chatService.getOrCreateChat(user.id, bot, ticket);

    if (!chat) {
      await ctx.reply(systemMessage(ChatMessages.chatCreationError));
      return;
    }

    return {chat, ticket, bot};
  }

  async handleChatMessage(ctx: MyContext) {
    if (!ctx.message || !('text' in ctx.message)) return;

    const validatedEntities = await this.validateCurrentChat(ctx);
    if(!validatedEntities) return

    const messageText = ctx.message.text;

    try {
      await this.processAndSendMessage(ctx, validatedEntities.bot, validatedEntities.chat, messageText, validatedEntities.ticket);
    } catch (error: any) {
      if (!error.message.includes('Subscription expired')) {
        await ctx.reply(systemMessage(ErrorMessages.processingError(error.message)));
      }
    }
  }

  private async processAndSendMessage(ctx: MyContext, bot: Bot, chat: Chat, messageText: string, ticket: Ticket) {
    ctx.sendChatAction('typing');
    const backendResponse = await this.chatService.handleTextMessage(chat, messageText, ctx, ticket);

    if (backendResponse.error) {
      await ctx.reply(systemMessage(ChatMessages.messageError));
      return;
    }

    if (!backendResponse.msg) {
      await ctx.reply(systemMessage(ChatMessages.noResponse));
      return;
    }

    await this.sendMessages(ctx, bot, chat, backendResponse.msg);
  }

  private async sendMessages(ctx: MyContext, bot: Bot, chat: Chat, messages: ChatMessage[]) {
    // Process messages in reverse order
    for (let i = messages.length; i > 0; i--) {
      const msg = messages[i - 1];

      if (!msg.text) return;

      if (msg.text === '__image__') {
        await ctx.sendChatAction('upload_photo');
        return;
      }

      await ctx.reply(botMessage(bot.displayName, msg.text));
    }
  }
}

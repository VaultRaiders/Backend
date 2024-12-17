import { MyContext } from '../../util/interface';
import { BaseHandler } from './base.handler';
import { MINI_APP_URL } from '../../config';
import { Bot, Chat, ChatMessage } from '../../infra/schema';
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

  private async getCurrentChat(ctx: MyContext) {
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
    const chat = await this.chatService.getOrCreateChat(user.id, bot);

    if (!chat) {
      await ctx.reply(systemMessage(ChatMessages.chatCreationError));
      return;
    }

    return chat;
  }

  async handleChatMessage(ctx: MyContext) {
    if (!ctx.message || !('text' in ctx.message)) return;

    const chat = await this.getCurrentChat(ctx);
    if (!chat) return;
    const bot = await this.botService.getBot(chat.botId);
    if (!bot) {
      return;
    }

    const messageText = ctx.message.text;

    try {
      const ticket = await this.botService.getAvailableTicket(bot.id, chat.userId);
      if (!ticket) {
        await ctx.reply(systemMessage(ChatMessages.subscriptionRequired(bot.displayName)), {
          parse_mode: 'HTML',
          ...createSubscriptionRequiredKeyboard(),
        });
        return;
      }

      await this.processAndSendMessage(ctx, bot, chat, messageText);
    } catch (error: any) {
      if (!error.message.includes('Subscription expired')) {
        await ctx.reply(systemMessage(ErrorMessages.processingError(error.message)));
      }
    }
  }

  private async processAndSendMessage(ctx: MyContext, bot: Bot, chat: Chat, messageText: string) {
    ctx.sendChatAction('typing');
    const backendResponse = await this.chatService.handleTextMessage(chat, messageText, ctx);

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

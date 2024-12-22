import { Telegraf } from 'telegraf';
import { User } from '../../infra/schema';
import { MyContext } from '../../util/interface';
import { systemMessage } from '../../util/common';
import { BotService } from '../../services/bot.service';
import { MainMessages } from '../../components/messages/main.messages';

export abstract class BaseHandler {
  protected readonly botService: BotService = BotService.getInstance();
  protected readonly bot: Telegraf<MyContext>;

  constructor(bot: Telegraf<MyContext>) {
    this.bot = bot;
  }

  async getMainMenuText(ctx: MyContext, user: User, hasWallet: boolean) {
    if (!hasWallet) {
      return systemMessage(MainMessages.welcomeNew(ctx.from?.first_name || 'darling'));
    }

    if (user.currentBotId) {
      const bot = await this.botService.getBotByUser(user.currentBotId, user.id);

      return systemMessage(MainMessages.welcomeActiveBot(ctx.from?.first_name || 'wizard', bot));
    }

    return systemMessage(MainMessages.welcomeBack(ctx.from?.first_name || 'wizard'));
  }

  async sendProcessingMessage(ctx: MyContext, isEdit = false) {
    await ctx.sendChatAction('typing');
    const message = systemMessage('⏳️ Your request is being processed...');

    if (isEdit) {
      await ctx.editMessageText(message);
      return ctx.msgId!;
    }

    const newMsg = await ctx.reply(message);
    return newMsg.message_id;
  }
}

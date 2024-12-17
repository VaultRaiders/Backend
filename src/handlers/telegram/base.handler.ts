import { Telegraf } from 'telegraf';
import { User } from '../../infra/schema';
import { MyContext } from '../../util/interface';
import { systemMessage } from '../../util/common';
import { BotService } from '../../services/bot.service';
import { createBackToMainKeyboard } from '../../components/keyboards/base';
import { createMainMenuKeyboard } from '../../components/keyboards/main.keyboards';
import { MainMessages } from '../../components/messages/main.messages';
import { WalletService } from '../../services/wallet.service';

interface SocialLink {
  name: string;
  link: string;
}

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
      const bot = await this.botService.getBot(user.currentBotId);
      const [ticket, botPrice, botBalance] = await Promise.all([
        this.botService.getAvailableTicket(bot.id, user.id),
        this.botService.getTicketPrice(bot.address || ''),
        this.botService.getBotBalance(bot.address || ''),
      ]);

      return systemMessage(MainMessages.welcomeActiveBot(ctx.from?.first_name || 'wizard', bot.displayName, botPrice, botBalance, !!ticket));
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

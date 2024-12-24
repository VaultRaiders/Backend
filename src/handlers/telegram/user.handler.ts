import { MyContext } from '../../util/interface';
import { BaseHandler } from './base.handler';
import { Bot, User } from '../../infra/schema';
import { UserService } from '../../services/user.service';
import { botMessage, hintMessage, systemMessage } from '../../util/common';
import { BotService } from '../../services/bot.service';
import { WalletService } from '../../services/wallet.service';
import { IBotResponse } from '../../types/responses/bot.response';
import { MainMessages } from '../../components/messages/main.messages';
import { createMainMenuKeyboard } from '../../components/keyboards/main.keyboards';

export class UserHandler extends BaseHandler {
  private readonly userService = UserService.getInstance();
  private readonly walletService = WalletService.getInstance();

  async handleMainMenu(ctx: MyContext, shouldEdit = false) {
    if (!ctx.from?.id) return;

    ctx.session = {};

    if (shouldEdit) {
      ctx.answerCbQuery();
    }

    const user = await this.userService.getOrCreateUser(ctx.from.id.toString(), ctx.from.username, ctx.chat?.id.toString());
    if (!user) {
      return ctx.reply('Failed to create user.');
    }

    let message: string;
    let hasActiveBot = false;
    const wallet = await this.walletService.getWalletInfo(ctx.from.id.toString());
    if (!wallet) {
      message = systemMessage(MainMessages.welcomeNew(ctx.from?.first_name || 'darling'));
    } else if (!user.currentBotId) {
      message = systemMessage(MainMessages.welcomeBack(ctx.from?.first_name || 'wizard'));
    } else {
      const bot = await this.botService.getBotByUser(user.currentBotId, user.id);
      hasActiveBot = bot.hasActiveTicket ?? false;
      message = systemMessage(MainMessages.welcomeActiveBot(ctx.from?.first_name || 'wizard', bot));
    }

    if (shouldEdit) {
      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        ...createMainMenuKeyboard(!!wallet, hasActiveBot),
      });
    } else {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        ...createMainMenuKeyboard(!!wallet, hasActiveBot),
      });
    }
  }
}

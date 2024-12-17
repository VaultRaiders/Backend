import { MyContext } from '../../util/interface';
import { BaseHandler } from './base.handler';
import { systemMessage } from '../../util/common';
import { UserService } from '../../services/user.service';
import { ErrorMessages } from '../../components/messages/error.messages';
import { TicketMessages } from '../../components/messages/ticket.message';
import { BotMessages } from '../../components/messages/bot.messages';
import { createTicketPurchaseKeyboard } from '../../components/keyboards/ticket.keyboards';
import { createBackToMainKeyboard } from '../../components/keyboards/base';
import { createOpenAppKeyboard } from '../../components/keyboards/main.keyboards';

export class TicketHandler extends BaseHandler {
  private readonly userService = UserService.getInstance();

  async handleBuyTicket(ctx: MyContext) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    const user = await this.userService.getOrCreateUser(userId, ctx.from?.username, ctx.chat?.id?.toString());
    if (!user) {
      return ctx.editMessageText(systemMessage(ErrorMessages.profileMixup));
    }
    if (!user.currentBotId) {
      return ctx.editMessageText(systemMessage(BotMessages.noBotSelected), createOpenAppKeyboard());
    }

    const bot = await this.botService.getBot(user.currentBotId);
    const ticketPrice = await this.botService.getTicketPrice(bot.address as string);
    const botId = user.currentBotId;

    ctx.session = {
      ...ctx.session,
      awaitingPassword: {
        action: 'buy_ticket',
        messageId: ctx.msgId,
        data: {
          botId,
          amount: 1,
        },
      },
    };

    await ctx.editMessageText(systemMessage(TicketMessages.requestPassword(bot.displayName, ticketPrice)), { parse_mode: 'HTML' });
  }

  async handlePasswordInput(ctx: MyContext, password: string) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    if (!ctx.session.awaitingPassword) {
      return ctx.reply(systemMessage(ErrorMessages.passwordProcess));
    }

    const { data, messageId } = ctx.session.awaitingPassword;

    await ctx.deleteMessage(ctx.msgId);
    if (messageId) {
      await ctx.deleteMessage(messageId);
    }
    const msgId = await this.sendProcessingMessage(ctx, false);

    try {
      const { botId, amount } = data;
      const bot = await this.botService.getBot(botId);
      await this.botService.buyTicket(botId, userId, password);

      await this.bot.telegram.editMessageText(ctx.chat?.id, msgId, undefined, systemMessage(TicketMessages.purchaseSuccess(bot.displayName)), {
        parse_mode: 'HTML',
        ...createBackToMainKeyboard(),
      });
    } catch (error: any) {
      await this.bot.telegram.editMessageText(ctx.chat?.id, msgId, undefined, systemMessage(ErrorMessages.processingError(error.message)), {
        parse_mode: 'HTML',
        ...createBackToMainKeyboard(),
      });
    }

    ctx.session = {
      ...ctx.session,
      awaitingPassword: undefined,
    };
  }
}

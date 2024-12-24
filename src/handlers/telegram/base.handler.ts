import { Telegraf } from 'telegraf';
import { Bot, User } from '../../infra/schema';
import { MyContext } from '../../util/interface';
import { systemMessage } from '../../util/common';
import { BotService } from '../../services/bot.service';
import { MainMessages } from '../../components/messages/main.messages';
import { IBotResponse } from '../../types/responses/bot.response';

export abstract class BaseHandler {
  protected readonly botService: BotService = BotService.getInstance();
  protected readonly bot: Telegraf<MyContext>;

  constructor(bot: Telegraf<MyContext>) {
    this.bot = bot;
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

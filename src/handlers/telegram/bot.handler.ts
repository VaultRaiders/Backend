import { MyContext } from '../../util/interface';
import { BaseHandler } from './base.handler';
import { Bot } from '../../infra/schema';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { botMessage, hintMessage, systemMessage } from '../../util/common';
import { ICreateBotData } from '../../util/interface';
import { createBackToMainKeyboard } from '../../components/keyboards/base';
import { createBotListKeyboard } from '../../components/keyboards/bot.keyboards';
import { ErrorMessages } from '../../components/messages/error.messages';
import { BotMessages } from '../../components/messages/bot.messages';

export class BotHandler extends BaseHandler {
  private readonly userService = UserService.getInstance();

  async GetOrCreateBotFromWebApp(ctx: MyContext) {
    const query = ctx.webAppData;
    const userId = ctx.from?.id.toString();

    if (!userId || !ctx.chat) {
      await ctx.reply(systemMessage(ErrorMessages.profileMixup));
      return;
    }

    let botInfo = query!.data.json() as Bot | ICreateBotData;
    let botDetail: Bot;

    if ('isNewBot' in botInfo) {
      botInfo = botInfo as ICreateBotData;
      await ctx.reply(systemMessage(BotMessages.passwordRequest));

      ctx.session = {
        ...ctx.session,
        awaitingPassword: {
          action: 'create_bot',
          data: botInfo,
          messageId: ctx.msgId,
        },
      };
      return;
    }

    botDetail = await this.botService.getBot((botInfo as Bot).id);
    await this.userService.updateCurrentBot(userId, botDetail.id);

    await ctx.sendChatAction('typing');
    await ctx.reply(systemMessage(BotMessages.selectionSuccess(botDetail.displayName)), { parse_mode: 'HTML' });

    // await this.chatService.getOrCreateChat(userId, botDetail);
    await this.sendBotGreeting(ctx, botDetail);
  }

  async sendBotGreeting(ctx: MyContext, botDetail: Bot) {
    await ctx.sendChatAction('upload_photo');
    if (botDetail.photoUrl) {
      await ctx.sendPhoto(botDetail.photoUrl);
    }

    if (botDetail.greeting) {
      await ctx.reply(botMessage(botDetail.displayName, botDetail.greeting));
    }

    await ctx.reply(hintMessage(BotMessages.showMenuHint));
  }

  async handleListValidBots(ctx: MyContext) {
    if (!ctx.from?.id) return;

    const userId = ctx.from.id.toString();
    const user = await this.userService.getOrCreateUser(userId, ctx.from?.username, ctx.chat?.id?.toString());
    if (!user) return;

    const validBots = await this.botService.getValidBotsForUser(userId);

    if (!validBots || validBots.length === 0) {
      await ctx.editMessageText(systemMessage(BotMessages.noValidBots), {
        parse_mode: 'HTML',
        ...createBackToMainKeyboard(),
      });
      return;
    }

    await ctx.editMessageText(systemMessage(BotMessages.validBotsList), {
      parse_mode: 'HTML',
      ...createBotListKeyboard(validBots, 'valid'),
    });
  }

  async handleListCreatedBots(ctx: MyContext) {
    if (!ctx.from?.id) return;

    const userId = ctx.from.id.toString();
    const user = await this.userService.getOrCreateUser(userId, ctx.from?.username, ctx.chat?.id?.toString());
    if (!user) return;

    const createdBots = await this.botService.getMyBots(userId);

    if (!createdBots || createdBots.length === 0) {
      await ctx.editMessageText(systemMessage(BotMessages.noCreatedBots), {
        parse_mode: 'HTML',
        ...createBackToMainKeyboard(),
      });
      return;
    }

    await ctx.editMessageText(systemMessage(BotMessages.createdBotsList), {
      parse_mode: 'HTML',
      ...createBotListKeyboard(createdBots, 'created'),
    });
  }

  async handleSelectBot(ctx: MyContext, botId: string) {
    if (!ctx.from?.id) return;

    const userId = ctx.from.id.toString();
    await this.userService.updateCurrentBot(userId, botId);

    const bot = await this.botService.getBot(botId);
    await ctx.editMessageText(systemMessage(BotMessages.selectionSuccess(bot.displayName)), {
      parse_mode: 'HTML',
      ...createBackToMainKeyboard(),
    });

    // await this.chatService.getOrCreateChat(userId, bot);
    await this.sendBotGreeting(ctx, bot);
  }
}

import { Telegraf } from 'telegraf';
import { User } from '../../infra/schema';
import { MyContext } from '../../util/interface';
import { systemMessage } from '../../util/common';
import { BotService } from '../../services/bot.service';
import { createBackToMainKeyboard } from '../../components/keyboards/base';
import { createMainMenuKeyboard } from '../../components/keyboards/main.keyboards';
import { MainMessages } from '../../components/messages/main.messages';

interface SocialLink {
  name: string;
  link: string;
}

export const formatSocialLinks = (socials: Array<{ name: string; link: string }>) =>
  `<b>━━━━ Our Social Circle ━━━━</b>\n${socials.map((s) => `<a href="${s.link}">${s.name}</a>`).join('  ')}`;

export abstract class BaseHandler {
  protected readonly botService: BotService = BotService.getInstance();
  protected readonly social: SocialLink[] = [
    {
      name: '𝕏 Twitter',
      link: 'https://twitter.com/vaultraiderai',
    },
    {
      name: '📢 Telegram',
      link: 'https://t.me/vaultraiderai',
    },
  ];
  protected readonly bot: Telegraf<MyContext>;

  constructor(bot: Telegraf<MyContext>) {
    this.bot = bot;
  }

  async getMainMenuText(ctx: MyContext, user: User, hasWallet: boolean) {
    if (!hasWallet) {
      return systemMessage(MainMessages.welcomeNew(ctx.from?.first_name || 'darling', formatSocialLinks(this.social)));
    }

    if (user.currentBotId) {
      const bot = await this.botService.getBot(user.currentBotId);
      const mySubscription = await this.botService.getSubscription(user.currentBotId, ctx.from?.id.toString() || '');

      return systemMessage(
        MainMessages.welcomeActiveBot(ctx.from?.first_name || 'darling', bot.displayName, mySubscription, formatSocialLinks(this.social)),
      );
    }

    return systemMessage(MainMessages.welcomeBack(ctx.from?.first_name || 'darling', formatSocialLinks(this.social)));
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

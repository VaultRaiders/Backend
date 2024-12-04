import { session, Telegraf } from 'telegraf';
import { MyContext } from '../util/interface';
import { TELEGRAM_BOT_TOKEN } from '../config';

export class Telegram {
  private static instance: Telegram;
  private bot: Telegraf<MyContext>;
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static userLastAction = new Map<string, number>();

  private constructor() {
    this.bot = new Telegraf<MyContext>(TELEGRAM_BOT_TOKEN);
    this.addMiddleware();
  }

  public static getInstance(): Telegram {
    if (!Telegram.instance) {
      Telegram.instance = new Telegram();
    }
    return Telegram.instance;
  }

  public getBot(): Telegraf<MyContext> {
    return this.bot;
  }

  private addMiddleware() {
    this.bot.use(session());
    this.bot.use(this.handleSession);
    this.bot.use(this.handleRateLimit);
    this.bot.use(this.parseMode);
  }

  async handleSession(ctx: MyContext, next: () => Promise<void>) {
    const now = Date.now();
    const lastActivity = ctx.session?.lastActivity || 0;

    if (now - lastActivity > Telegram.SESSION_TIMEOUT) {
      ctx.session = {};
    }
    ctx.session.lastActivity = now;
    return next();
  }

  async handleRateLimit(ctx: MyContext, next: () => Promise<void>) {
    const userId = ctx.from?.id.toString();
    if (!userId) return next();

    const now = Date.now();
    const lastAction = Telegram.userLastAction.get(userId) || 0;

    if (now - lastAction < 1000) {
      await ctx.reply('⚠️ Please wait a moment before sending another command.');
      return;
    }

    Telegram.userLastAction.set(userId, now);
    return next();
  }
  
  async parseMode(ctx: MyContext, next: () => Promise<void>) {
    const originalReply = ctx.reply.bind(ctx);
    const originalEdit = ctx.editMessageText.bind(ctx);

    ctx.reply = (text, extra = {}) => {
      return originalReply(text, { parse_mode: 'HTML', ...extra });
    };

    ctx.editMessageText = (text, extra = {}) => {
      return originalEdit(text, { parse_mode: 'HTML', ...extra });
    };

    return next();
  }
}
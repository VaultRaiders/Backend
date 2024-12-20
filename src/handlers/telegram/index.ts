import { Telegraf, session } from 'telegraf';
import { WalletService } from '../../services/wallet.service';
import { ICreateBotData, MyContext } from '../../util/interface';
import { ChatHandler } from './chat.handler';
import { TicketHandler } from './ticket.handler';
import { WalletHandler } from './wallet.handler';
import { UserService } from '../../services/user.service';
import { BotHandler } from './bot.handler';
import { Telegram } from '../../infra/telegram';
import { createBackToMainKeyboard } from '../../components/keyboards/base';
import { createMainMenuKeyboard } from '../../components/keyboards/main.keyboards';

export class TelegramBot {
  private bot: Telegraf<MyContext>;
  private walletHandler: WalletHandler;
  private chatHandler: ChatHandler;
  private ticketHandler: TicketHandler;
  private botHandler: BotHandler;

  private userService = UserService.getInstance();

  constructor() {
    this.bot = Telegram.getInstance().getBot();

    this.walletHandler = new WalletHandler(this.bot);
    this.chatHandler = new ChatHandler(this.bot);
    this.ticketHandler = new TicketHandler(this.bot);
    this.botHandler = new BotHandler(this.bot);

    this.initializeBot();
  }

  private initializeBot() {
    this.registerCommands();
    this.registerActions();
    this.registerMessageHandlers();
    this.handleErrors();
  }

  private async registerCommands() {
    this.bot.start(async (ctx) => {
      if (!ctx.from?.id) return;

      const user = await this.userService.getOrCreateUser(ctx.from.id.toString(), ctx.from.username, ctx.chat?.id.toString());
      if (!user) {
        return ctx.reply('Failed to create user.');
      }

      const wallet = await WalletService.getInstance().getWalletInfo(ctx.from.id.toString());
      await ctx.reply(await this.walletHandler.getMainMenuText(ctx, user, !!wallet), {
        parse_mode: 'HTML',
        ...createMainMenuKeyboard(!!wallet),
      });
    });
  }

  private registerActions() {
    this.bot.action('main_menu', async (ctx) => {
      if (!ctx.from?.id) return;
      const user = await this.userService.getOrCreateUser(ctx.from.id.toString(), ctx.from.username, ctx.chat?.id.toString());
      if (!user) {
        return ctx.reply('Failed to create user.');
      }
      const wallet = await WalletService.getInstance().getWalletInfo(ctx.from.id.toString());

      await ctx.editMessageText(await this.walletHandler.getMainMenuText(ctx, user, !!wallet), {
        parse_mode: 'HTML',
        ...createMainMenuKeyboard(!!wallet),
      });

      ctx.session = {};
    });

    // Feature unavailable
    this.bot.action('feature_unavailable', async (ctx) => {
      await ctx.answerCbQuery('⚠️ This feature is currently under development.');
    });

    // BASE

    // Wallet actions
    this.bot.action('manage_wallet', (ctx) => this.walletHandler.handleManageWallet(ctx));
    this.bot.action('create_wallet', (ctx) => this.walletHandler.handleCreateWallet(ctx));
    this.bot.action('delete_wallet', (ctx) => this.walletHandler.handleDeleteWallet(ctx));
    this.bot.action('confirm_delete_wallet', (ctx) => this.walletHandler.handleConfirmDeleteWallet(ctx));
    this.bot.action('cancel_delete_wallet', (ctx) => this.walletHandler.handleCancelDeleteWallet(ctx));

    // Ticket actions
    this.bot.action('buy_ticket', (ctx) => this.ticketHandler.handleBuyTicket(ctx));

    this.bot.action('list_valid_bots', (ctx) => this.botHandler.handleListValidBots(ctx));
    this.bot.action('list_created_bots', (ctx) => this.botHandler.handleListCreatedBots(ctx));
    this.bot.action(/^select_bot:(.+)$/, (ctx) => {
      const botId = ctx.match[1];
      return this.botHandler.handleSelectBot(ctx, botId);
    });
  }

  private registerMessageHandlers() {
    this.bot.on('text', async (ctx) => {
      const userId = ctx.from?.id.toString();
      if (!userId) return;

      if (ctx.session.awaitingPassword) {
        const password = ctx.message.text;
        const { action, data } = ctx.session.awaitingPassword;

        if (action === 'buy_ticket') {
          await this.ticketHandler.handlePasswordInput(ctx, password);
        } else if (['create_wallet', 'import_wallet'].includes(action)) {
          await this.walletHandler.handlePasswordInput(ctx, password);
        }
      } else {
        await this.chatHandler.handleChatMessage(ctx);
      }
    });
  }

  private handleErrors() {
    this.bot.catch((err: any, ctx: MyContext) => {
      console.error(`Error for ${ctx.updateType}:`, err);
      ctx
        .reply('❌ An error occurred. Please try again later.', {
          parse_mode: 'HTML',
          ...createBackToMainKeyboard(),
        })
        .catch(console.error);
    });
  }

  public launch() {
    return this.bot.launch();
  }

  public stop() {
    return this.bot.stop();
  }
}

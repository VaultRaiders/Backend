import { formatEther, parseEther } from 'ethers';
import { MyContext } from '../../util/interface';
import { BaseHandler } from './base.handler';
import { systemMessage } from '../../util/common';
import { WalletService } from '../../services/wallet.service';
import { cryptoAmountRound } from '../../util/format';
import { createInlineKeyboard, createBackToMainKeyboard, cancelKeyboard } from '../../components/keyboards/base';
import { createWalletKeyboard, deleteWalletKeyboard } from '../../components/keyboards/wallet.keyboards';
import { WalletMessages } from '../../components/messages/wallet.messages';
import { ErrorMessages } from '../../components/messages/error.messages';

export class WalletHandler extends BaseHandler {
  private readonly walletService = WalletService.getInstance();

  async handleManageWallet(ctx: MyContext) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    const wallet = await this.walletService.getWalletInfo(userId);
    let message: string;

    if (wallet) {
      const balanceWei = await this.walletService.getBalance(wallet.address);

      message = WalletMessages.walletInfo(wallet.address, balanceWei);
    } else {
      message = WalletMessages.noWallet;
    }

    await ctx.editMessageText(systemMessage(message), {
      parse_mode: 'HTML',
      ...createWalletKeyboard(!!wallet),
    });
  }

  async handleCreateWallet(ctx: MyContext) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    const wallet = await this.walletService.getWalletInfo(userId);
    if (wallet) {
      await ctx.reply(systemMessage(WalletMessages.walletExists), {
        parse_mode: 'HTML',
        ...createWalletKeyboard(true),
      });
      return;
    }

    await ctx.editMessageText(systemMessage(WalletMessages.createNew), { parse_mode: 'HTML' });

    ctx.session = {
      ...ctx.session,
      awaitingPassword: {
        action: 'create_wallet',
        messageId: ctx.msgId,
      },
    };
  }

  async handleDeleteWallet(ctx: MyContext) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    if (!ctx.session.awaitingDeleteConfirmation) {
      ctx.session.awaitingDeleteConfirmation = true;
      await ctx.editMessageText(systemMessage(WalletMessages.deleteConfirmation), {
        parse_mode: 'HTML',
        ...deleteWalletKeyboard(),
      });
      return;
    }
  }

  async handleConfirmDeleteWallet(ctx: MyContext) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    await this.walletService.deleteWallet(userId);
    ctx.session.awaitingDeleteConfirmation = false;

    await ctx.editMessageText(systemMessage(WalletMessages.deleteSuccess), {
      parse_mode: 'HTML',
      ...createWalletKeyboard(false),
    });
  }

  async handleCancelDeleteWallet(ctx: MyContext) {
    ctx.session.awaitingDeleteConfirmation = false;
    await ctx.editMessageText(systemMessage(WalletMessages.deleteCancelled), {
      parse_mode: 'HTML',
      ...createWalletKeyboard(true),
    });
  }

  async handlePasswordInput(ctx: MyContext, password: string) {
    const userId = ctx.from?.id.toString();
    if (!userId) return;

    if (!ctx.session.awaitingPassword) {
      return ctx.reply(systemMessage(ErrorMessages.passwordProcess));
    }

    const { action, data, messageId } = ctx.session.awaitingPassword;
    await ctx.deleteMessage(ctx.message?.message_id);
    if (messageId) {
      await ctx.deleteMessage(messageId);
    }
    const msgId = await this.sendProcessingMessage(ctx, false);

    try {
      if (action === 'create_wallet') {
        await this.handleCreateWalletWithPassword(ctx, userId, password, msgId);
      }
    } catch (error: any) {
      await this.handlePasswordError(ctx, error, msgId);
    }

    ctx.session = {
      ...ctx.session,
      awaitingPassword: undefined,
    };
  }

  private async handleCreateWalletWithPassword(ctx: MyContext, userId: string, password: string, msgId: number) {
    const wallet = await this.walletService.createWallet(userId, password);

    await ctx.telegram.editMessageText(ctx.chat?.id, msgId, undefined, systemMessage(WalletMessages.createSuccess(wallet.address)), {
      parse_mode: 'HTML',
    });

    await ctx.reply(systemMessage(WalletMessages.privateKeyInfo(wallet.privateKey)), {
      parse_mode: 'HTML',
      ...createBackToMainKeyboard(),
    });
  }

  private async handlePasswordError(ctx: MyContext, error: Error, msgId: number) {
    await ctx.telegram.editMessageText(ctx.chat?.id, msgId, undefined, systemMessage(ErrorMessages.processingError(error.message)), {
      parse_mode: 'HTML',
    });
  }

  async checkWalletExists(ctx: MyContext, userId: string): Promise<boolean> {
    const wallet = await this.walletService.getWalletInfo(userId);
    if (!wallet) {
      await ctx.reply(systemMessage(WalletMessages.walletRequired), {
        parse_mode: 'HTML',
        ...createBackToMainKeyboard(),
      });
      return false;
    }
    return true;
  }
}

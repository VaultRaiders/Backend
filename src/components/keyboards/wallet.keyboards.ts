import { ButtonConfig } from '../buttons';
import { createInlineKeyboard } from './base';

export const createWalletKeyboard = (hasWallet: boolean) => {
  const buttons: ButtonConfig[][] = [];

  if (!hasWallet) {
    buttons.push([
      { text: '⚡ Create New Wallet', callback_data: 'create_wallet' },
      { text: '✨ Import Wallet', callback_data: 'import_wallet' },
    ]);
  } else {
    buttons.push([{ text: '💔 Dissolve Wallet', callback_data: 'delete_wallet' }]);
  }

  buttons.push([{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }]);

  return createInlineKeyboard(buttons);
};

export const deleteWalletKeyboard = () => {
  return createInlineKeyboard([
    [
      { text: '💔 Confirm Dissolution', callback_data: 'confirm_delete_wallet' },
      { text: '✨ Maintain Wards', callback_data: 'cancel_delete_wallet' },
    ],
  ]);
};

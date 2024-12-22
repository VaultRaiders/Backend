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
    buttons.push([{ text: '🗑️ Delete Wallet', callback_data: 'delete_wallet' }]);
  }

  buttons.push([{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }]);

  return createInlineKeyboard(buttons);
};

export const deleteWalletKeyboard = () => {
  return createInlineKeyboard([
    [
      { text: '🗑️ Confirm', callback_data: 'confirm_delete_wallet' },
      { text: '❌ Not Yet', callback_data: 'manage_wallet' },
    ],
  ]);
};

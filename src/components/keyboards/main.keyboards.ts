import { MINI_APP_URL } from '../../config';
import { createInlineKeyboard, createSingleRowKeyboard } from './base';

export const createMainMenuKeyboard = (hasWallet: boolean) => {
  if (!hasWallet) {
    return createSingleRowKeyboard([{ text: '⚡ Create Wallet', callback_data: 'create_wallet' }]);
  }

  return createInlineKeyboard([
    [{ text: '⚔️ Challenge Guardians', callback_data: MINI_APP_URL, type: 'web_app' }],
    [
      { text: '🎟️ Acquire Permit', callback_data: 'buy_ticket' },
      { text: '🟢 Active Duels', callback_data: 'list_valid_bots' },
    ],
    [{ text: '👛 My Wallet', callback_data: 'manage_wallet' }],
    [{ text: '🏰 Guardian Registry', callback_data: 'list_created_bots' }],
  ]);
};

export const createOpenAppKeyboard = () =>
  createInlineKeyboard([
    [{ text: '⚔️ Challenge Guardians', callback_data: MINI_APP_URL, type: 'web_app' }],
    [{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }],
  ]);

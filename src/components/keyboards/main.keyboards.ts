import { MINI_APP_URL } from '../../config';
import { EMOJI } from '../messages/constant';
import { createInlineKeyboard, createSingleRowKeyboard } from './base';
import { ButtonConfig } from '../buttons';

export const createMainMenuKeyboard = (hasWallet: boolean, hasTicket: boolean) => {
  if (!hasWallet) {
    return createSingleRowKeyboard([{ text: `${EMOJI.WALLET} Create Wallet`, callback_data: 'create_wallet' }]);
  }

  let ticketButtons: ButtonConfig[] = [];

  if (hasTicket) {
    ticketButtons = [{ text: '🟢 Active Battles', callback_data: 'list_valid_bots' }];
  } else {
    ticketButtons = [
      { text: '🎟️ Buy Ticket', callback_data: 'buy_ticket' },
      { text: '🟢 Active Battles', callback_data: 'list_valid_bots' },
    ];
  }

  return createInlineKeyboard([
    [{ text: '⚔️ Challenge Guardians', callback_data: MINI_APP_URL, type: 'web_app' }],
    [...ticketButtons],
    [{ text: '👛 My Wallet', callback_data: 'manage_wallet' }],
  ]);
};

export const createOpenAppKeyboard = () =>
  createInlineKeyboard([
    [{ text: '⚔️ Challenge Guardians', callback_data: MINI_APP_URL, type: 'web_app' }],
    [{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }],
  ]);

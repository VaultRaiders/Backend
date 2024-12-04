import { createInlineKeyboard } from './base';

export const createTicketPurchaseKeyboard = () =>
  createInlineKeyboard([
    [{ text: '💎 ETH Crystals', callback_data: 'buy_ticket_sol' }],
    [{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }],
  ]);

import { createInlineKeyboard } from './base';

export const createSubscriptionRequiredKeyboard = () => {
  return createInlineKeyboard([
    [
      { text: '🎟️ Buy Ticket', callback_data: 'buy_ticket' },
      { text: '◀️ Return to Grand Hall', callback_data: 'main_menu' },
    ],
  ]);
};

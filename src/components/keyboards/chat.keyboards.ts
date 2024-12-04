import { createInlineKeyboard } from './base';

export const createSubscriptionRequiredKeyboard = () => {
  return createInlineKeyboard([
    [
      { text: '📜 Acquire Permit', callback_data: 'buy_ticket' },
      { text: '◀️ Return to Grand Hall', callback_data: 'main_menu' },
    ],
  ]);
};

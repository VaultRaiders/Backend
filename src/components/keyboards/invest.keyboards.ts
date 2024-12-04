import { createInlineKeyboard } from './base';

export const createInvestMenuKeyboard = () =>
  createInlineKeyboard([
    [
      { text: '✨ Acquire Seals', callback_data: 'buy_key' },
      { text: '💫 Release Seals', callback_data: 'sell_key' },
    ],
    [{ text: '⚡ Claim Tribute', callback_data: 'withdraw_revenue' }],
    [{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }],
  ]);

export const createKeyTradeConfirmationKeyboard = () => {
  return createInlineKeyboard([
    [
      { text: '✨ Proceed', callback_data: 'confirm_key_trade' },
      { text: '💭 Not Yet', callback_data: 'cancel_key_trade' },
    ],
  ]);
};

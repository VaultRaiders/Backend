import { MINI_APP_URL } from '../../config';
import { Bot } from '../../infra/schema';
import { IBotResponse } from '../../types/responses/bot.response';
import { TERMS } from '../messages/constant';
import { createInlineKeyboard } from './base';

export const createBotListKeyboard = (bots: IBotResponse[], type: 'valid' | 'created') => {
  const buttons = bots.map((bot) => [
    { text: `${bot.isActive ? '🟢' : '🔴'} ${bot.displayName} (${bot.balance} ${TERMS.CURRENCY_SYMBOL})`, callback_data: `select_bot:${bot.id}` },
  ]);

  buttons.push([{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }]);

  return createInlineKeyboard(buttons);
};

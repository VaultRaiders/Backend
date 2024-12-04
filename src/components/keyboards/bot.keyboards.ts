import { MINI_APP_URL } from '../../config';
import { Bot } from '../../infra/schema';
import { createInlineKeyboard } from './base';

export const createBotListKeyboard = (bots: Bot[], type: 'valid' | 'created') => {
  const buttons = bots.map((bot) => [{ text: `⚔️ ${bot.displayName}`, callback_data: `select_bot:${bot.id}` }]);

  buttons.push([{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }]);

  return createInlineKeyboard(buttons);
};

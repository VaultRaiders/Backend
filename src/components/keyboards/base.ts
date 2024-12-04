import { Markup } from 'telegraf';
import { ButtonConfig, createInlineButton, createUrlButton, createWebAppButton } from '../buttons';

export const createInlineKeyboard = (buttons: ButtonConfig[][]) =>
  Markup.inlineKeyboard(
    buttons.map((row) =>
      row.map((button) => {
        if (button.type === 'web_app') {
          return createWebAppButton(button.text, button.callback_data);
        } else if (button.type === 'url') {
          return createUrlButton(button.text, button.callback_data);
        } else {
          return createInlineButton(button.text, button.callback_data);
        }
      }),
    ),
  );

export const createSingleRowKeyboard = (buttons: ButtonConfig[]) => createInlineKeyboard([buttons]);

export const createBackToMainKeyboard = () => createSingleRowKeyboard([{ text: '◀️ Return to Grand Hall', callback_data: 'main_menu' }]);

export const cancelKeyboard = () => {
  return createInlineKeyboard([[{ text: '❌ Cancel Ritual', callback_data: 'main_menu' }]]);
};

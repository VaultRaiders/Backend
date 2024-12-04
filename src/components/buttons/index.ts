import { Markup } from 'telegraf';

export interface ButtonConfig {
  text: string;
  callback_data: string;
  type?: "web_app" | "callback" | "url";
}

export const createInlineButton = (text: string, callback_data: string) => Markup.button.callback(text, callback_data);

export const createWebAppButton = (text: string, url: string) => Markup.button.webApp(text, url);

export const createUrlButton = (text: string, url: string) => Markup.button.url(text, url);
import { envConfig } from '@/config';
import { Bot } from 'grammy';
import type { BotContext } from './context';

export const bot = new Bot<BotContext>(envConfig.telegram.botToken, {
    client: envConfig.app.env === 'production' ? { apiRoot: envConfig.telegram.apiRoot } : undefined,
});

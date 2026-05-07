import type { MyContext } from '@/app/bot/context';
import { envConfig } from '@/config';
import { Bot } from 'grammy';

export const bot = new Bot<MyContext>(envConfig.telegram.botToken, {
    client: envConfig.app.env === 'production' ? { apiRoot: envConfig.telegram.apiRoot } : undefined,
});

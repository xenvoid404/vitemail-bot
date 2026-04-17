import type { MyContext } from '@/app/bot/context';
import envConf from '@/config/env';
import { Bot } from 'grammy';

export const bot = new Bot<MyContext>(envConf.telegram.botToken, {
    client: envConf.app.env === 'production' ? { apiRoot: envConf.telegram.apiRoot } : undefined,
});

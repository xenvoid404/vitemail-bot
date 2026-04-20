import type { MyContext } from '@/app/bot/context';
import appConf from '@/config/app';
import telegramConf from '@/config/telegram';
import { Bot } from 'grammy';

export const bot = new Bot<MyContext>(telegramConf.botToken, {
    client: appConf.env === 'production' ? { apiRoot: telegramConf.apiRoot } : undefined,
});

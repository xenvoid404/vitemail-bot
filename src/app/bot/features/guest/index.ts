import { startCommand } from '@/app/bot/features/guest/start';
import type { BotContext } from '@/bot/context';
import { Composer } from 'grammy';

const composer = new Composer<BotContext>();

composer.command('start', (ctx) => startCommand(ctx));
composer.callbackQuery('user_back_to_main', (ctx) => startCommand(ctx));

export default composer;

import type { MyContext } from '@/app/bot/context';
import { startCommand } from '@/app/bot/features/guest/start';
import { Composer } from 'grammy';

const composer = new Composer<MyContext>();

composer.command('start', (ctx) => startCommand(ctx));
composer.callbackQuery('user_back_to_main', (ctx) => startCommand(ctx));

export default composer;

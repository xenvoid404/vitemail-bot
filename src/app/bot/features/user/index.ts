import type { MyContext } from '@/app/bot/context';
import { emailCustom } from '@/app/bot/features/user/email/email-custom';
import { emailDelete } from '@/app/bot/features/user/email/email-delete';
import { emailRandom } from '@/app/bot/features/user/email/email-random';
import { Composer } from 'grammy';

const composer = new Composer<MyContext>();

composer.callbackQuery('user_random_email', (ctx) => emailRandom(ctx));
composer.callbackQuery('user_custom_email', (ctx) => emailCustom.inputEmail(ctx));
composer.callbackQuery('user_delete_email', (ctx) => emailDelete(ctx));
composer.on('message:text', (ctx, next) => emailCustom.processCreate(ctx, next));

export default composer;

import type { MyContext } from '@/app/bot/context';
import { emailCustom } from '@/app/bot/features/user/email/email-custom';
import { emailDelete } from '@/app/bot/features/user/email/email-delete';
import { emailInbox } from '@/app/bot/features/user/email/email-inbox';
import { emailRandom } from '@/app/bot/features/user/email/email-random';
import { Composer } from 'grammy';

const composer = new Composer<MyContext>();

composer.callbackQuery('user_email_random', (ctx) => emailRandom(ctx));
composer.callbackQuery('user_email_custom', (ctx) => emailCustom.inputEmail(ctx));
composer.callbackQuery('user_email_delete', (ctx) => emailDelete(ctx));
composer.callbackQuery(/^user_email_inbox_page_(\d+)$/, (ctx) => emailInbox(ctx));
composer.on('message:text', (ctx, next) => emailCustom.processCreate(ctx, next));

export default composer;

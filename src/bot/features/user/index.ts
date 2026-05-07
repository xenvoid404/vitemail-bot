import { emailCustom } from '@/app/bot/features/user/email/email-custom';
import { emailDelete } from '@/app/bot/features/user/email/email-delete';
import { emailInbox } from '@/app/bot/features/user/email/email-inbox';
import { emailRandom } from '@/app/bot/features/user/email/email-random';
import { emailRead } from '@/app/bot/features/user/email/email-read';
import type { BotContext } from '@/bot/context';
import { Composer } from 'grammy';
import { startCommand } from './start.command';

const user = new Composer<BotContext>();

user.command('start', startCommand);
user.callbackQuery('user_home', startCommand);
user.callbackQuery('user_back_to_main', startCommand);
user.callbackQuery('user_email_random', (ctx) => emailRandom(ctx));
user.callbackQuery('user_email_custom', (ctx) => emailCustom.inputEmail(ctx));
user.callbackQuery('user_email_delete', (ctx) => emailDelete(ctx));
user.callbackQuery(/^user_email_inbox_page_(\d+)$/, (ctx) => emailInbox(ctx));
user.callbackQuery(/^user_inbox_read_(\d+)$/, (ctx) => emailRead(ctx));
user.on('message:text', (ctx, next) => emailCustom.processCreate(ctx, next));

export default user;

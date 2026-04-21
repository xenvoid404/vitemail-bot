import type { MyContext } from '@/app/bot/context';
import type { Inbox } from '@/lib/postgres/types';
import { cleanExcessiveSpaces, escapeTelegramHtml } from '@/lib/utils/formatter';
import { logger } from '@/lib/utils/logger';
import { InboxService } from '@/services/database/inbox-service';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import { InlineKeyboard } from 'grammy';

dayjs.locale('id');

export async function emailRead(ctx: MyContext) {
    if (!ctx.callbackQuery || !ctx.match) return;
    await ctx.answerCallbackQuery();

    try {
        const inboxId = parseInt(ctx.match[1]);
        const inbox = await InboxService.getById(inboxId);
        if (!inbox) {
            return await ctx.editMessageText('❌ Pesan tidak ditemukan atau sudah dihapus.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_email_inbox_page_1'),
            });
        }

        const message = buildMainMessage(inbox);
        const keyboard = new InlineKeyboard().text('🔙 Kembali', 'user_email_inbox_page_1');

        return await ctx.editMessageText(message, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (err) {
        logger.error('email-read.ts', err);
        return ctx.editMessageText('❌ Terjadi kesalahan sistem. Coba lagi nanti atau hubungi admin.', {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_email_inbox_page_1'),
        });
    }
}

function buildMainMessage(inbox: Inbox): string {
    const maxBodyLength = 3000;
    const cleanBody = cleanExcessiveSpaces(inbox.body);
    let safeBody = escapeTelegramHtml(cleanBody);
    safeBody = safeBody.length > maxBodyLength ? safeBody.substring(0, maxBodyLength) + '... [Pesan dipotong karena terlalu panjang]' : safeBody;

    return [
        '📥 <b>EMAIL MASUK</b>',
        '━━━━━━━━━━━━━━━━━━━━━━━━',
        `<b>Dari:</b> <code>${escapeTelegramHtml(inbox.from)}</code>`,
        `<b>Kepada:</b> <code>${escapeTelegramHtml(inbox.to)}</code>`,
        `<b>Subjek:</b> ${escapeTelegramHtml(inbox.subject)}`,
        `<b>Waktu:</b> ${dayjs(inbox.createdAt).format('DD MMM, HH:mm')}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━',
        `<pre>${safeBody}</pre>`,
    ].join('\n');
}

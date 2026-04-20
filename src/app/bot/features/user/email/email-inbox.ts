import type { MyContext } from '@/app/bot/context';
import type { Inbox } from '@/lib/postgres/types';
import { logger } from '@/lib/utils/logger';
import { EmailService } from '@/services/database/email-service';
import { InboxService } from '@/services/database/inbox-service';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import { InlineKeyboard } from 'grammy';

dayjs.locale('id');
const PER_PAGE = 5;

export async function emailInbox(ctx: MyContext) {
    if (!ctx.callbackQuery || !ctx.match) return;
    await ctx.answerCallbackQuery();

    try {
        const user = ctx.session.user?.me;
        if (!user) {
            return await ctx.editMessageText('❌ Sesi kadaluarsa. Silahkan mulai ulang bot.', {
                parse_mode: 'HTML',
            });
        }

        const activeEmail = await EmailService.getActiveByUserId(user.id);
        if (!activeEmail) {
            return await ctx.editMessageText('❌ Kamu tidak memiliki email sementara yang aktif.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }

        const page = parseInt(ctx.match[1]);
        const { items, totalPages } = await InboxService.getPaginatedByEmailId(activeEmail.id, page, PER_PAGE);
        if (items.length === 0) {
            return await ctx.editMessageText('📭 Kotak masuk kamu masih kosong.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }

        const message = buildMainMessage(items, page, totalPages);
        const keyboard = buildMainKeyboard(items, page, totalPages);

        return await ctx.editMessageText(message, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (err) {
        logger.error('email-inbox.ts', err);
        return ctx.editMessageText('❌ Terjadi kesalahan sistem. Coba lagi nanti atau hubungi admin.', {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
        });
    }
}

function buildMainMessage(inboxes: Inbox[], page: number, totalPages: number): string {
    const message = ['<b>📥 DAFTAR KOTAK MASUK</b>', `<i>Halaman ${page} dari ${totalPages}</i>`, '━━━━━━━━━━━━━━━━━━━━━━━━'];

    inboxes.forEach((inbox, index) => {
        message.push(`<b>[ ${index + 1} ] ${inbox.fromName || inbox.from}</b>`);
        message.push(`✏️ Subjek: ${inbox.subject}`);
        message.push(`🕒 Waktu: ${dayjs(inbox.createdAt).format('DD MMM, HH:mm')}`);
        message.push('━━━━━━━━━━━━━━━━━━━━━━━━');
    });
    message.push('<i>Pilih angka dibawah untuk membaca isi pesan</i>');

    return message.join('\n');
}

function buildMainKeyboard(inboxes: Inbox[], page: number, totalPages: number): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    inboxes.forEach((inbox, index) => {
        keyboard.text(`${index + 1}`, `user_inbox_read_${inbox.id}`);
        if ((index + 1) % 5 === 0) {
            keyboard.row();
        }
    });

    if (inboxes.length % 5 !== 0) {
        keyboard.row();
    }

    if (page > 1) {
        keyboard.text('⬅️ Prev', `user_email_inbox_page_${page - 1}`);
    }
    if (page < totalPages) {
        keyboard.text('➡️ Next', `user_email_inbox_page_${page + 1}`);
    }

    keyboard.row();
    keyboard.text('🔙 Kembali', 'user_back_to_main');

    return keyboard;
}

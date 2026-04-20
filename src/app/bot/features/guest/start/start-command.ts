import type { MyContext } from '@/app/bot/context';
import type { Email, User } from '@/lib/postgres/types';
import { logger } from '@/lib/utils/logger';
import { AdminSession, UserSession } from '@/lib/utils/session-control';
import { EmailService } from '@/services/database/email-service';
import { UserService } from '@/services/database/user-service';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import { InlineKeyboard } from 'grammy';

export const startCommand = async (ctx: MyContext) => {
    if (!ctx.from) return;
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    if (UserSession.isBusy(ctx) || AdminSession.isBusy(ctx)) {
        UserSession.resetFlow(ctx);
        AdminSession.resetFlow(ctx);
    }

    try {
        let user;
        let created = false;

        if (ctx.session.user?.me) {
            user = ctx.session.user.me;
            logger.debug('start-command.ts', 'Berhasil mengambil data user dari session');
        } else {
            const res = await createOrUpdateUser(ctx);
            user = res.user;
            created = res.created;
            if (created) logger.info('start-command.ts', `New user registered: ${user.chatId} (@${user.username})`);

            ctx.session.user = { me: user, flow: { type: 'IDLE' } };
        }

        const activeEmail = await EmailService.getActiveByUserId(user.id);

        const message = await buildMainMessage(user, activeEmail);
        const keyboard = buildMainKeyboard(activeEmail);
        const options = { parse_mode: 'HTML' as const, reply_markup: keyboard };

        if (ctx.callbackQuery) {
            return await ctx.editMessageText(message, options);
        }

        return await ctx.reply(message, options);
    } catch (err) {
        logger.error('start-command.ts', err);

        const errMsg = '<b>❌ Terjadi kesalahan sistem. Silahkan coba lagi nanti atau hubungi admin.</b>';
        const options = { parse_mode: 'HTML' as const };

        if (ctx.callbackQuery) {
            return ctx.editMessageText(errMsg, options);
        }

        return ctx.reply(errMsg, options);
    }
};

const createOrUpdateUser = async (ctx: MyContext) => {
    const chatId = ctx.from!.id;
    const username = ctx.from!.username || `user_${chatId}`;
    const firstName = ctx.from!.first_name || username;
    const lastName = ctx.from!.last_name || '';

    let user = await UserService.getByChatId(chatId);
    let created = false;

    if (user) {
        await UserService.updateByChatId(chatId, { username, firstName, lastName });
        user = { ...user, username, firstName, lastName };
    } else {
        user = await UserService.create({ chatId, username, firstName, lastName });
        created = true;
    }

    return { user, created };
};

const buildMainMessage = (user: User, activeEmail: Email | undefined): string => {
    if (activeEmail) {
        const expiredTime = dayjs(activeEmail.expiredAt).locale('id').format('DD MMMM YYYY, HH:mm');
        const createdTime = dayjs(activeEmail.createdAt).locale('id').format('DD MMMM YYYY, HH:mm');

        return [
            `Halo, <b>${user.firstName}</b>! 👋`,
            'Kamu masih memiliki <b>email sementara yang sedang aktif</b>:',
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            `<b>📧 Alamat:</b> <code>${activeEmail.address}</code>`,
            `<b>⏳ Kadaluarsa:</b> ${expiredTime}`,
            `<b>📅 Dibuat:</b> ${createdTime}`,
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            '<i>Sistem akan memberikan notifikasi jika ada pesan baru masuk.</i>',
        ].join('\n');
    }

    return [
        `Halo, <b>${user.firstName}</b>! 👋`,
        'Bot ini memungkinkan kamu membuat <b>alamat email sementara</b> secara instan, tanpa registrasi, tanpa data pribadi.',
        '━━━━━━━━━━━━━━━━━━━━━━━━',
        '<b>✨ Fitur Tersedia:</b>',
        '🎲 <b>Email Acak</b> — buat email instan',
        '✏️ <b>Email Custom</b> — pilih prefixmu sendiri',
        '🔔 <b>Notifikasi Real-time</b> — terima email langsung',
        '━━━━━━━━━━━━━━━━━━━━━━━━',
        '<i>Pilih aksi dari menu di bawah ini:</i>',
    ].join('\n');
};

const buildMainKeyboard = (activeEmail: Email | undefined): InlineKeyboard => {
    if (activeEmail) {
        return new InlineKeyboard().text('🗑️ Hapus Email Ini', 'user_delete_email');
    }

    return new InlineKeyboard().text('🎲 Email Acak', 'user_random_email').text('✏️ Email Custom', 'user_custom_email');
};

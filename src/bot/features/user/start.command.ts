import { FlowManager, type BotContext } from '@/bot/context';
import { sendOrAlert, sendOrEdit } from '@/lib/bot-helpers';
import { DIVIDER, formatDate } from '@/lib/formatter';
import { logger } from '@/lib/logger';
import { EmailRepository } from '@/repositories';
import { InlineKeyboard } from 'grammy';

export async function startCommand(ctx: BotContext) {
    if (FlowManager.isBusy(ctx)) FlowManager.resetFlow(ctx);

    try {
        const user = ctx.session.user!.me!;
        const activeEmail = await EmailRepository.findBy('userId', user.id);

        let msg: string = '';
        const kb = new InlineKeyboard();
        if (activeEmail) {
            msg = [
                `Halo, <b>${user.firstName}</b>! 👋`,
                'Kamu masih memiliki <b>email sementara yang sedang aktif</b>:',
                DIVIDER,
                `<b>📧 Alamat:</b> <code>${activeEmail.address}</code>`,
                `<b>📅 Dibuat:</b> ${formatDate(activeEmail.createdAt)}`,
                `<b>⏳ Kadaluarsa:</b> ${formatDate(activeEmail.expiredAt)}`,
                DIVIDER,
                '<i>Sistem akan memberikan notifikasi jika ada pesan baru masuk.</i>',
            ].join('\n');
            kb.text('📥 Cek Inbox', 'user_email_inbox_page_1').row().text('🗑️ Hapus Email', 'user_email_delete');
        } else {
            msg = [
                `Halo, <b>${user.firstName}</b>! 👋`,
                'Bot ini memungkinkan kamu membuat <b>alamat email sementara</b> secara instan, tanpa registrasi, tanpa data pribadi.',
                DIVIDER,
                '<b>✨ Fitur Tersedia:</b>',
                '🎲 <b>Email Acak</b> — buat email instan',
                '✏️ <b>Email Custom</b> — pilih prefixmu sendiri',
                '🔔 <b>Notifikasi Realtime</b> — terima email langsung',
                '📥 <b>Cek Inbox</b> — baca ulang pesan yang masuk',
                DIVIDER,
                '<i>Pilih aksi dari menu di bawah ini:</i>',
            ].join('\n');
            kb.text('🎲 Email Acak', 'user_email_random').text('✏️ Email Custom', 'user_email_custom');
        }

        return await sendOrEdit(ctx, msg, kb);
    } catch (err) {
        logger.error('start:command', err);
        return sendOrAlert(ctx, '❌ Terjadi kesalahan sistem.');
    }
}

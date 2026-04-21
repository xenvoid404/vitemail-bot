import type { MyContext } from '@/app/bot/context';
import { logger } from '@/lib/utils/logger';
import { EmailService } from '@/services/database/email-service';
import { InlineKeyboard } from 'grammy';

export async function emailDelete(ctx: MyContext) {
    if (!ctx.callbackQuery || !ctx.from) return;
    await ctx.answerCallbackQuery();

    try {
        const user = ctx.session.user?.me;
        if (!user) {
            return ctx.editMessageText('❌ Sesi kadaluarsa. Silahkan mulai ulang bot.', {
                parse_mode: 'HTML',
            });
        }

        await EmailService.deleteByUserId(user.id);

        const message = [
            '🗑️ <b>EMAIL BERHASIL DIHAPUS</b>',
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            'Sesi email kamu telah ditutup.',
            'Data alamat email tersebut tidak lagi terhubung dengan akun kamu.',
            '',
            '<i>Silahkan kembali ke menu utama jika ingin membuat yang baru.</i>',
        ].join('\n');

        return await ctx.editMessageText(message, {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
        });
    } catch (err) {
        logger.error('email-delete.ts', err);
        return ctx.editMessageText('<b>❌ Terjadi kesalahan sistem. Coba lagi nanti atau hubungi admin.</b>', {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
        });
    }
}

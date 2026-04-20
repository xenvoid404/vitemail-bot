import type { MyContext } from '@/app/bot/context';
import { logger } from '@/lib/utils/logger';
import { ConfigService } from '@/services/database/config-service';
import { DomainService } from '@/services/database/domain-service';
import { EmailService } from '@/services/database/email-service';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import { InlineKeyboard } from 'grammy';

export const emailRandom = async (ctx: MyContext) => {
    if (!ctx.callbackQuery || !ctx.from) return;
    await ctx.answerCallbackQuery();

    try {
        const user = ctx.session.user?.me;
        if (!user) {
            return ctx.editMessageText('❌ Sesi kadaluarsa. Silahkan mulai ulang bot.', {
                parse_mode: 'HTML',
            });
        }

        const application = await ConfigService.getConfig();
        if (!application) {
            return ctx.editMessageText('❌ Terjadi kesalahan pada konfigurasi internal. Silahkan coba lagi nanti.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }

        const activeEmail = await EmailService.getActiveByUserId(user.id);
        if (activeEmail) {
            return ctx.editMessageText('⚠️ Kamu masih memiliki email aktif! Harap hapus terlebih dahulu jika ingin membuat yang baru.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🗑️ Hapus Email Ini', 'user_delete_email').row().text('🔙 Kembali', 'user_back_to_main'),
            });
        }

        const domain = await DomainService.getRandom();
        if (!domain) {
            return ctx.editMessageText('❌ Belum ada domain yang tersedia. Silahkan cek kembali nanti.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }

        let fullEmail = '';
        let isEmailAvailable = false;
        let attempts = 0;

        while (!isEmailAvailable && attempts < 3) {
            const randomStr = faker.internet
                .username()
                .replace(/[^a-z0-9_]/g, '')
                .toLowerCase();

            fullEmail = `${randomStr}@${domain.name}`;
            const existingMail = await EmailService.getByAddress(fullEmail);

            if (!existingMail) {
                isEmailAvailable = true;
            }
            attempts++;
        }

        if (!isEmailAvailable) {
            return ctx.editMessageText('❌ Gagal menghasilkan alamat email yang unik. Silahkan coba lagi.', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }

        const expiredDate = dayjs().locale('id').add(application.emailExpired, 'minute');
        const expiredTime = expiredDate.format('DD MMM YYYY, HH:mm');

        const email = await EmailService.create({
            userId: user.id,
            domainId: domain.id,
            address: fullEmail,
            expiredAt: expiredDate.toDate(),
        });

        const message = [
            '✅ EMAIL BERHASIL DIBUAT!',
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            `<b>📧 Alamat:</b> <code>${email.address}</code>`,
            `<b>⏳ Kadaluarsa:</b> ${expiredTime}`,
            `<b>📅 Dibuat:</b> ${dayjs(email.createdAt).format('DD MMM YYYY, HH:mm')}`,
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            `<i>💡 Tap alamat email di atas untuk menyalin.</i>`,
        ].join('\n');

        return ctx.editMessageText(message, {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text('🗑️ Hapus Email Ini', 'user_delete_email').row().text('🔙 Kembali', 'user_back_to_main'),
        });
    } catch (err) {
        logger.error('email-random.ts', err);
        return ctx.editMessageText('<b>❌ Terjadi kesalahan sistem. Silahkan coba lagi nanti atau hubungi admin.</b>', {
            parse_mode: 'HTML',
            reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
        });
    }
};

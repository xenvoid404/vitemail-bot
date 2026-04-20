import type { MyContext } from '@/app/bot/context';
import { logger } from '@/lib/utils/logger';
import { ConfigService } from '@/services/database/config-service';
import { DomainService } from '@/services/database/domain-service';
import { EmailService } from '@/services/database/email-service';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import { InlineKeyboard, type NextFunction } from 'grammy';

export const emailCustom = {
    async inputEmail(ctx: MyContext) {
        if (!ctx.callbackQuery || !ctx.session.user) return;
        await ctx.answerCallbackQuery();

        try {
            const user = ctx.session.user.me;
            if (!user) {
                return ctx.editMessageText('❌ Sesi kadaluarsa. Silahkan mulai ulang bot.', {
                    parse_mode: 'HTML',
                });
            }

            const activeEmail = await EmailService.getActiveByUserId(user.id);
            if (activeEmail) {
                return ctx.editMessageText('⚠️ Kamu masih memiliki email aktif! Harap hapus terlebih dahulu jika ingin membuat yang baru.', {
                    parse_mode: 'HTML',
                    reply_markup: new InlineKeyboard().text('🗑️ Hapus Email Ini', 'user_delete_email').row().text('🔙 Kembali', 'user_back_to_main'),
                });
            }

            const domains = await DomainService.getAll();
            if (domains.length === 0) {
                return await ctx.editMessageText('❌ Belum ada daftar domain yang tersedia saat ini.', {
                    parse_mode: 'HTML',
                    reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
                });
            }

            const domainList = domains.map((domain) => `• <code>${domain.name}</code>`).join('\n');
            const message = [
                '✏️ <b>BUAT EMAIL CUSTOM</b>',
                'Ketik prefix email yang kamu inginkan.',
                'Contoh: <code>namasaya</code> atau <code>namasaya@domain.com</code>',
                '',
                '<b>Domain tersedia:</b>',
                domainList,
                '',
                '<i>Min. 3 karakter, hanya huruf kecil, angka, titik, underscore.</i>',
            ].join('\n');

            ctx.session.user.flow = { type: 'CREATE_EMAIL_CUSTOM', step: 'INPUT_EMAIL' };

            return await ctx.editMessageText(message, {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('❌ Batal', 'user_back_to_main'),
            });
        } catch (err) {
            logger.error('email-custom.ts', err);
            return ctx.editMessageText('<b>❌ Terjadi kesalahan sistem. Silahkan coba lagi nanti atau hubungi admin.</b>', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }
    },
    async processCreate(ctx: MyContext, next: NextFunction) {
        if (!ctx.msg?.text || !ctx.session.user) return;

        const currentFlow = ctx.session.user.flow;
        if (currentFlow.type !== 'CREATE_EMAIL_CUSTOM' || currentFlow.step !== 'INPUT_EMAIL') {
            return await next();
        }

        try {
            const input = ctx.msg.text.trim().toLowerCase();
            let prefix = input;
            let domainName = '';

            if (input.includes('@')) {
                const parts = input.split('@');
                prefix = parts[0];
                domainName = parts[1];
            }

            const prefixRegex = /^[a-z0-9_.]{3,}$/;
            if (!prefixRegex.test(prefix)) {
                const message = [
                    '⚠️ <b>Format Tidak Valid!</b>',
                    'Minimal 3 karakter. Hanya boleh menggunakan huruf kecil, angka, titik (.), dan underscore (_).',
                ].join('\n');

                await ctx.reply(message, {
                    parse_mode: 'HTML',
                    reply_parameters: { message_id: ctx.msg.message_id },
                });

                return;
            }

            let selectedDomain;
            if (domainName) {
                selectedDomain = await DomainService.getByName(domainName);
                if (!selectedDomain) {
                    await ctx.reply(`⚠️ Domain <code>@${domainName}</code> tidak tersedia. Silahkan cek daftar domain yang didukung.`, {
                        parse_mode: 'HTML',
                        reply_parameters: { message_id: ctx.msg.message_id },
                    });
                    return;
                }
            } else {
                selectedDomain = await DomainService.getRandom();
                if (!selectedDomain) {
                    ctx.session.user.flow = { type: 'IDLE' };
                    return await ctx.reply('❌ Belum ada domain yang tersedia saat ini.');
                }
            }

            const fullEmail = `${prefix}@${selectedDomain.name}`;
            const existingMail = await EmailService.getByAddress(fullEmail);
            if (existingMail) {
                await ctx.reply(`❌ Alamat <code>${fullEmail}</code> sudah digunakan. Silahkan kirimkan nama awalan yang berbeda.`, {
                    parse_mode: 'HTML',
                    reply_parameters: { message_id: ctx.msg.message_id },
                });
                return;
            }

            const user = ctx.session.user.me;
            if (!user) {
                return ctx.reply('❌ Sesi kadaluarsa. Silahkan mulai ulang bot.', {
                    parse_mode: 'HTML',
                });
            }

            const application = await ConfigService.getConfig();
            if (!application) {
                return ctx.reply('❌ Terjadi kesalahan pada konfigurasi internal. Silahkan coba lagi nanti.', {
                    parse_mode: 'HTML',
                    reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
                });
            }

            const expiredDate = dayjs().locale('id').add(application.emailExpired, 'minute');
            const expiredTime = expiredDate.format('DD MMM YYYY, HH:mm');

            const email = await EmailService.create({
                userId: user.id,
                domainId: selectedDomain.id,
                address: fullEmail,
                expiredAt: expiredDate.toDate(),
            });

            ctx.session.user.flow = { type: 'IDLE' };

            const message = [
                '✅ <b>EMAIL BERHASIL DIBUAT!</b>',
                '━━━━━━━━━━━━━━━━━━━━━━━━',
                `<b>📧 Alamat:</b> <code>${email.address}</code>`,
                `<b>⏳ Kadaluarsa:</b> ${expiredTime} WIB`,
                `<b>📅 Dibuat:</b> ${dayjs(email.createdAt).format('DD MMM YYYY, HH:mm')}`,
                '━━━━━━━━━━━━━━━━━━━━━━━━',
                `<i>💡 Tap alamat email di atas untuk menyalin.</i>`,
            ].join('\n');

            return ctx.reply(message, {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard()
                    .text('📥 Cek Inbox', 'user_email_inbox_page_1')
                    .row()
                    .text('🗑️ Hapus Email Ini', 'user_delete_email')
                    .row()
                    .text('🔙 Kembali', 'user_back_to_main'),
            });
        } catch (err) {
            logger.error('email-custom.ts', err);
            ctx.session.user.flow = { type: 'IDLE' };
            return ctx.editMessageText('<b>❌ Terjadi kesalahan sistem. Silahkan coba lagi nanti atau hubungi admin.</b>', {
                parse_mode: 'HTML',
                reply_markup: new InlineKeyboard().text('🔙 Kembali', 'user_back_to_main'),
            });
        }
    },
};

import { bot } from '@/app/bot/instance';
import appConf from '@/config/app';
import { cleanExcessiveSpaces, escapeTelegramHtml } from '@/lib/utils/formatter';
import { logger } from '@/lib/utils/logger';
import { EmailService } from '@/services/database/email-service';
import { InboxService } from '@/services/database/inbox-service';
import { UserService } from '@/services/database/user-service';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import type { Request, Response } from 'express';

dayjs.locale('id');

export async function emailWebhook(req: Request, res: Response) {
    try {
        const payload = req.body;
        if (payload.secret !== appConf.key) {
            logger.warn('email-webhook.ts', 'Unauthorized webhook attempt');
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }

        logger.info('email-webhook.ts', `Memproses email untuk: ${payload.to}`);

        const emailRecord = await EmailService.getByAddress(payload.to);
        if (!emailRecord) {
            return res.status(200).json({ status: false, message: 'Email address not found or expired' });
        }

        const user = await UserService.getById(emailRecord.userId);
        if (!user) {
            return res.status(200).json({ status: false, message: 'User not found' });
        }

        const inbox = await InboxService.create({
            emailId: emailRecord.id,
            to: payload.to,
            from: payload.from,
            fromName: payload.fromName,
            subject: payload.subject,
            body: payload.body,
            bodyHtml: payload.bodyHtml,
            rawSize: payload.rawSize,
        });

        const maxBodyLength = 3000;
        const cleanBody = cleanExcessiveSpaces(inbox.body);
        let safeBody = escapeTelegramHtml(cleanBody);
        safeBody = safeBody.length > maxBodyLength ? safeBody.substring(0, maxBodyLength) + '... [Pesan dipotong karena terlalu panjang]' : safeBody;

        const message = [
            '📥 <b>EMAIL BARU MASUK!</b>',
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            `<b>Dari:</b> <code>${escapeTelegramHtml(inbox.from)}</code>`,
            `<b>Kepada:</b> <code>${escapeTelegramHtml(inbox.to)}</code>`,
            `<b>Subjek:</b> ${escapeTelegramHtml(inbox.subject)}`,
            `<b>Waktu:</b> ${dayjs(inbox.createdAt).format('DD MMM, HH:mm')}`,
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            `<pre>${safeBody}</pre>`,
        ].join('\n');

        await bot.api.sendMessage(user.chatId, message, {
            parse_mode: 'HTML',
        });

        return res.status(200).json({ status: true, message: 'Notification sent' });
    } catch (err) {
        logger.error('email-webhook.ts', err);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

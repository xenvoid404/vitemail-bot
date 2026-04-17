import { bot } from '@/app/bot/instance';
import envConf from '@/config/env';
import { logger } from '@/lib/utils/logger';
import { EmailService } from '@/services/database/email-service';
import { UserService } from '@/services/database/user-service';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import type { Request, Response } from 'express';

export const emailWebhook = async (req: Request, res: Response): Promise<any> => {
    try {
        const payload = req.body;
        if (payload.secret !== envConf.app.key) {
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

        const maxBodyLength = 3000;
        let safeBody =
            payload.body.length > maxBodyLength
                ? payload.body.substring(0, maxBodyLength) + '... [Pesan dipotong karena terlalu panjang]'
                : payload.body;
        safeBody = safeBody.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const message = [
            '📥 <b>EMAIL BARU MASUK!</b>',
            '━━━━━━━━━━━━━━━━━━━━━━━━',
            `<b>Dari:</b> <code>${payload.from}</code>`,
            `<b>Kepada:</b> <code>${payload.to}</code>`,
            `<b>Subjek:</b> ${payload.subject}`,
            `<b>Waktu:</b> ${dayjs().locale('id').format('DD MMMM YYYY, HH:mm')}`,
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
};

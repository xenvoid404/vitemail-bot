import type { BotContext } from '@/bot/context';
import { envConfig } from '@/config';
import { sendOrAlert } from '@/lib/bot-helpers';
import { logger } from '@/lib/logger';
import { ConfigRepository } from '@/repositories';
import type { NextFunction } from 'grammy';

export async function maintenanceMiddleware(ctx: BotContext, next: NextFunction) {
    try {
        const config = await ConfigRepository.get();
        if (!config) {
            await sendOrAlert(ctx, '❌ Kesalahan konfigurasi internal');
            return;
        }
        if (config.isMaintenance) {
            await sendOrAlert(ctx, `🔧 ${envConfig.app.name} sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.`);
            return;
        }
        await next();
    } catch (err) {
        logger.error('middleware:maintenance', err);
        return sendOrAlert(ctx, '❌ Terjadi kesalahan sistem');
    }
}

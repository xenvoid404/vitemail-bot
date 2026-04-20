import type { MyContext } from '@/app/bot/context';
import { logger } from '@/lib/utils/logger';
import type { NextFunction } from 'grammy';

export async function isRegistered(ctx: MyContext, next: NextFunction) {
    if (!ctx.from) return;

    if (!ctx.session.user) {
        logger.info('is-registered.ts', `User tidak terdaftar mengakses bot: ${ctx.from.id} (@${ctx.from.username || 'Unknown'}`);
        return await ctx.reply('❌ Kamu belum terdaftar. Silahkan kirimkan perintah /start terlebih dahulu.', { parse_mode: 'HTML' });
    }

    return await next();
}

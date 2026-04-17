import type { MyContext } from '@/app/bot/context';
import type { NextFunction } from 'grammy';

export const isRegistered = async (ctx: MyContext, next: NextFunction) => {
    if (!ctx.session.user) {
        return await ctx.reply('❌ Kamu belum terdaftar. Silahkan kirimkan perintah /start terlebih dahulu.', { parse_mode: 'HTML' });
    }

    return await next();
};

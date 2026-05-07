import type { BotContext } from '@/bot/context';
import { sendOrAlert } from '@/lib/bot-helpers';
import { logger } from '@/lib/logger';
import { UserRepository } from '@/repositories';
import type { NextFunction } from 'grammy';

export async function authMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
    if (!ctx.from) return;
    if (ctx.session.user?.me) return await next();

    try {
        const chatId = ctx.from.id;
        const username = ctx.from.username ?? `user_${chatId}`;
        const user = await UserRepository.upsert({
            chatId: chatId,
            username: username,
            firstName: ctx.from.first_name ?? username,
            lastName: ctx.from.last_name,
        });

        ctx.session.user = { me: user, flow: { type: 'IDLE' } };
        return await next();
    } catch (err) {
        logger.error('middleware:auth', err);
        return sendOrAlert(ctx, '❌ Terjadi kesalahan sistem.');
    }
}

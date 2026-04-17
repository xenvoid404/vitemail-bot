import type { MyContext } from '@/app/bot/context';
import { logger } from '@/lib/utils/logger';
import { UserService } from '@/services/database/user-service';
import type { NextFunction } from 'grammy';

export const authMiddleware = async (ctx: MyContext, next: NextFunction) => {
    if (!ctx.from?.id) return next();

    try {
        if (ctx.session.user?.me) {
            return next();
        }

        const user = await UserService.getByChatId(String(ctx.from.id));
        if (user) {
            ctx.session.user = {
                me: user,
                flow: { type: 'IDLE' },
            };
        }
    } catch (err) {
        logger.error('auth.ts', err);
    }

    return await next();
};

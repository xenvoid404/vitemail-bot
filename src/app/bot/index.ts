import type { MyContext, SessionData } from '@/app/bot/context';
import guestFeatures from '@/app/bot/features/guest';
import userFeatures from '@/app/bot/features/user';
import { bot } from '@/app/bot/instance';
import { authMiddleware } from '@/app/bot/middleware/auth';
import { isRegistered } from '@/app/bot/middleware/is-registered';
import { redis } from '@/lib/redis';
import { logger } from '@/lib/utils/logger';
import { RedisAdapter } from '@grammyjs/storage-redis';
import { GrammyError, HttpError, session } from 'grammy';

export const setupBot = () => {
    bot.use(session({ initial: (): SessionData => ({}), storage: new RedisAdapter<SessionData>({ instance: redis, ttl: 60 * 10 }) }));
    bot.use(authMiddleware);
    bot.use(guestFeatures);

    const isTargetUser = (ctx: MyContext) => {
        const data = ctx.callbackQuery?.data || '';
        const flow = ctx.session.user?.flow;

        const isCallback = data.startsWith('user_');
        const isFlowActive = Boolean(flow && flow.type !== 'IDLE');

        return isCallback || isFlowActive;
    };
    const user = bot.filter(isTargetUser);
    user.use(isRegistered);
    user.use(userFeatures);

    bot.catch((err) => {
        const ctx = err.ctx;
        const e = err.error;
        const updateId = ctx.update.update_id;

        if (e instanceof GrammyError) {
            logger.error('bot.index.ts', `Error in request [Update ID: ${updateId}]:`, e.description);
        } else if (e instanceof HttpError) {
            logger.error('bot.index.ts', `Could not contact Telegram [Update ID: ${updateId}]:`, e);
        } else {
            logger.error('bot.index.ts', `Unknown error [Update ID: ${updateId}]:`, e);
        }
    });
};

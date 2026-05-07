import type { MyContext, SessionData } from '@/app/bot/context';
import guestFeatures from '@/app/bot/features/guest';
import userFeatures from '@/app/bot/features/user';
import { bot } from '@/app/bot/instance';
import { authMiddleware } from '@/app/bot/middleware/auth';
import { isRegistered } from '@/app/bot/middleware/is-registered';
import { logger } from '@/lib/logger';
import { redis } from '@/lib/redis';
import { RedisAdapter } from '@grammyjs/storage-redis';
import { GrammyError, HttpError, session } from 'grammy';

export function setupBot() {
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
        const e = err.error;
        const updateId = err.ctx.update.update_id;
        if (e instanceof GrammyError) {
            if ((e as any).description?.includes('message is not modified')) return;
            logger.error('bot:grammyError', e, { updateId });
        } else if (e instanceof HttpError) {
            logger.error('bot:httpError', e, { updateId });
        } else {
            logger.error('bot:unknownError', e instanceof Error ? e : String(e), { updateId });
        }
    });
}

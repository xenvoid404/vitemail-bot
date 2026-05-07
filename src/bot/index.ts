import guestFeatures from '@/app/bot/features/guest';
import userFeatures from '@/app/bot/features/user';
import { authMiddleware } from '@/app/bot/middleware/auth';
import { isRegistered } from '@/app/bot/middleware/is-registered';
import { logger } from '@/lib/logger';
import { GrammyError, HttpError } from 'grammy';
import type { BotContext } from './context';
import { bot } from './instance';
import { maintenanceMiddleware } from './middleware/maintenance.middleware';
import { sessionMiddleware } from './middleware/session.middleware';

export function setupBot() {
    bot.use(sessionMiddleware());
    bot.use(maintenanceMiddleware);
    bot.use(authMiddleware);
    bot.use(guestFeatures);

    const isTargetUser = (ctx: BotContext) => {
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

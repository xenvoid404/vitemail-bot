import userFeatures from '@/bot/features/user';
import { logger } from '@/lib/logger';
import { GrammyError, HttpError } from 'grammy';
import type { BotContext } from './context';
import { bot } from './instance';
import { authMiddleware } from './middlewares/auth.middleware';
import { maintenanceMiddleware } from './middlewares/maintenance.middleware';
import { sessionMiddleware } from './middlewares/session.middleware';

function isUserCtx(ctx: BotContext): boolean {
    const text = ctx.msg?.text ?? '';
    const data = ctx.callbackQuery?.data ?? '';
    const flow = ctx.session.user?.flow;
    return text.startsWith('/start') || data.startsWith('user_') || Boolean(flow && flow.type !== 'IDLE');
}

export function setupBot(): void {
    bot.use(sessionMiddleware());
    bot.use(maintenanceMiddleware);
    bot.use(authMiddleware);

    const userRouter = bot.filter(isUserCtx);
    userRouter.use(userFeatures);

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

import type { MyContext } from '@/app/bot/context';
import { redis } from '@/lib/redis';

export class UserSession {
    static async invalidate(chatId: number) {
        const key = chatId.toString();
        await redis.del(key);
    }
    static resetData(ctx: MyContext) {
        if (ctx.session.user?.me) {
            ctx.session.user.me = null;
        }
    }
    static resetFlow(ctx: MyContext) {
        if (ctx.session.user?.flow) {
            ctx.session.user.flow = { type: 'IDLE' };
        }
    }
    static isBusy(ctx: MyContext): boolean {
        return !!ctx.session.user?.flow && ctx.session.user.flow.type !== 'IDLE';
    }
}

export class AdminSession {
    static resetFlow(ctx: MyContext) {
        if (ctx.session.admin?.flow) {
            ctx.session.admin.flow = { type: 'IDLE' };
        }
    }
    static isBusy(ctx: MyContext): boolean {
        return !!ctx.session.admin?.flow && ctx.session.admin.flow.type !== 'IDLE';
    }
}

import { userRole } from '@/db/schema';
import type { User } from '@/db/types';
import type { Context, SessionFlavor } from 'grammy';
import type { AdminSession, UserSession } from './types';

export interface SessionData {
    admin?: {
        flow: AdminSession;
    };
    user?: {
        me: User | null;
        flow: UserSession;
    };
}

export type BotContext = Context & SessionFlavor<SessionData>;

type SessionRole = Extract<(typeof userRole.enumValues)[number], keyof SessionData>;
const ALL_ROLES: SessionRole[] = ['admin', 'user'];

export class FlowManager {
    static isBusy(ctx: BotContext, target: SessionRole | SessionRole[] = ALL_ROLES): boolean {
        const roles = Array.isArray(target) ? target : [target];
        return roles.some((role) => {
            const scope = ctx.session[role];
            return !!scope?.flow && scope.flow.type !== 'IDLE';
        });
    }
    static resetFlow(ctx: BotContext, target: SessionRole | SessionRole[] = ALL_ROLES): void {
        const roles = Array.isArray(target) ? target : [target];
        roles.forEach((role) => {
            const scope = ctx.session[role];
            if (scope?.flow) {
                scope.flow = { type: 'IDLE' } as any;
            }
        });
    }
}

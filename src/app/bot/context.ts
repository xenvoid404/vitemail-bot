import { AdminSessionState } from '@/app/bot/types/admin-session';
import { UserSessionState } from '@/app/bot/types/user-session';
import type { User } from '@/lib/sqlite/types';
import type { Context, SessionFlavor } from 'grammy';

export interface SessionData {
    admin?: {
        flow: AdminSessionState;
    };
    user?: {
        me: User | null;
        flow: UserSessionState;
    };
}

export type MyContext = Context & SessionFlavor<SessionData>;

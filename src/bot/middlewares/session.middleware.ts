import { SessionData } from '@/bot/context';
import { RedisStorage } from '@/bot/session';
import { session } from 'grammy';

export function sessionMiddleware() {
    return session({ initial: (): SessionData => ({}), storage: new RedisStorage<SessionData>() });
}

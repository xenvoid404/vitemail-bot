import { db } from '@/lib/postgres';
import { users } from '@/lib/postgres/schema';
import type { NewUser, User } from '@/lib/postgres/types';
import { eq } from 'drizzle-orm';

export class UserService {
    static async create(data: NewUser): Promise<User> {
        const result = await db.insert(users).values(data).returning();
        return result[0];
    }
    static async getById(id: User['id']): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result.length > 0 ? result[0] : null;
    }
    static async getByChatId(chatId: User['chatId']): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.chatId, chatId));
        return result.length > 0 ? result[0] : null;
    }
    static async updateByChatId(chatId: User['chatId'], data: Partial<NewUser>): Promise<User> {
        const result = await db.update(users).set(data).where(eq(users.chatId, chatId)).returning();
        return result[0];
    }
}

import { db } from '@/lib/postgres';
import { users } from '@/lib/postgres/schema';
import type { NewUser, User } from '@/lib/postgres/types';
import { eq } from 'drizzle-orm';

export class UserService {
    static async create(data: NewUser): Promise<User> {
        const newUser = await db.insert(users).values(data).returning();
        return newUser[0];
    }
    static async getById(id: User['id']): Promise<User | undefined> {
        return await db.query.users.findFirst({ where: eq(users.id, id) });
    }
    static async getByChatId(chatId: User['chatId']): Promise<User | undefined> {
        return await db.query.users.findFirst({ where: eq(users.chatId, chatId) });
    }
    static async updateByChatId(chatId: User['chatId'], data: Partial<NewUser>): Promise<void> {
        await db.update(users).set(data).where(eq(users.chatId, chatId));
    }
}

import { db } from '@/db';
import { users } from '@/db/schema';
import type { NewUser, User } from '@/db/types';

export class UserRepository {
    static async upsert(data: NewUser): Promise<User> {
        const [row] = await db
            .insert(users)
            .values(data)
            .onConflictDoUpdate({ target: users.chatId, set: { username: data.username, firstName: data.firstName, lastName: data.lastName } })
            .returning();
        return row;
    }
}

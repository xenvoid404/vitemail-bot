import { db } from '@/db';
import { emails } from '@/db/schema';
import type { Email, NewEmail } from '@/db/types';
import { buildWhereCondition } from '@/lib/repository';

export class EmailRepository {
    static async create(data: NewEmail): Promise<Email> {
        const [row] = await db.insert(emails).values(data).returning();
        return row;
    }
    static async findBy<K extends keyof Email>(col: K, val: Email[K]): Promise<Email | null> {
        const where = buildWhereCondition(emails, col as any, val);
        const [row] = await db.select().from(emails).where(where).limit(1);
        return row ?? null;
    }
}

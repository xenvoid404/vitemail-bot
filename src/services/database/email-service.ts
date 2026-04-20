import { db } from '@/lib/postgres';
import { emails } from '@/lib/postgres/schema';
import type { Email, NewEmail } from '@/lib/postgres/types';
import dayjs from 'dayjs';
import 'dayjs/locale/id.js';
import { and, eq, gt } from 'drizzle-orm';

dayjs.locale('id');

export class EmailService {
    static async create(data: NewEmail): Promise<Email> {
        const result = await db.insert(emails).values(data).returning();
        return result[0];
    }
    static async getByAddress(address: Email['address']): Promise<Email | null> {
        const result = await db.select().from(emails).where(eq(emails.address, address));
        return result.length > 0 ? result[0] : null;
    }
    static async getActiveByUserId(userId: Email['userId']): Promise<Email | null> {
        const result = await db
            .select()
            .from(emails)
            .where(and(eq(emails.userId, userId), gt(emails.expiredAt, dayjs().toDate())));
        return result.length > 0 ? result[0] : null;
    }
    static async deleteByUserId(userId: Email['userId']): Promise<void> {
        await db.delete(emails).where(eq(emails.userId, userId));
    }
}

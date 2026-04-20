import { db } from '@/lib/postgres';
import { emails } from '@/lib/postgres/schema';
import type { Email, NewEmail } from '@/lib/postgres/types';
import { and, eq, gt } from 'drizzle-orm';

export class EmailService {
    static async create(data: NewEmail): Promise<Email> {
        const newEmail = await db.insert(emails).values(data).returning();
        return newEmail[0];
    }
    static async getByAddress(address: Email['address']): Promise<Email | undefined> {
        return await db.query.emails.findFirst({ where: eq(emails.address, address) });
    }
    static async getActiveByUserId(userId: Email['userId']): Promise<Email | undefined> {
        return await db.query.emails.findFirst({ where: and(eq(emails.userId, userId), gt(emails.expiredAt, new Date())) });
    }
    static async deleteByUserId(userId: Email['userId']): Promise<void> {
        await db.delete(emails).where(eq(emails.userId, userId));
    }
}

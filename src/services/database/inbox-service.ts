import { db } from '@/lib/postgres';
import { inboxes } from '@/lib/postgres/schema';
import type { Inbox, NewInbox } from '@/lib/postgres/types';
import { desc, eq, sql } from 'drizzle-orm';

export class InboxService {
    static async create(data: NewInbox): Promise<Inbox> {
        const result = await db.insert(inboxes).values(data).returning();
        return result[0];
    }
    static async getById(id: Inbox['id']): Promise<Inbox | null> {
        const result = await db.select().from(inboxes).where(eq(inboxes.id, id));
        return result.length > 0 ? result[0] : null;
    }
    static async getPaginatedByEmailId(emailId: Inbox['emailId'], page: number, limit: number) {
        const offset = (page - 1) * limit;
        const [items, countResult] = await Promise.all([
            db.select().from(inboxes).where(eq(inboxes.emailId, emailId)).orderBy(desc(inboxes.createdAt)).limit(limit).offset(offset),
            db
                .select({ count: sql<number>`cast(count(${inboxes.id}) as int)` })
                .from(inboxes)
                .where(eq(inboxes.emailId, emailId)),
        ]);

        const totalCount = countResult[0]?.count || 0;

        return { items: items, totalPages: Math.ceil(totalCount / limit) || 1 };
    }
}

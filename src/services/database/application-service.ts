import { db } from '@/lib/sqlite';
import { applications } from '@/lib/sqlite/schema';
import type { Application } from '@/lib/sqlite/types';
import { eq } from 'drizzle-orm';

export class ApplicationService {
    static async getConfig(): Promise<Application | undefined> {
        return await db.query.applications.findFirst({ where: eq(applications.id, 1) });
    }
}

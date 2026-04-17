import { db } from '@/lib/sqlite';
import { domains } from '@/lib/sqlite/schema';
import type { Domain } from '@/lib/sqlite/types';
import { asc, eq, sql } from 'drizzle-orm';

export class DomainService {
    static async getRandom(): Promise<Domain | undefined> {
        return await db.query.domains.findFirst({ orderBy: sql`RANDOM()` });
    }
    static async getAll(): Promise<Domain[]> {
        return await db.query.domains.findMany({ orderBy: [asc(domains.name)] });
    }
    static async getByName(name: Domain['name']): Promise<Domain | undefined> {
        return await db.query.domains.findFirst({ where: eq(domains.name, name) });
    }
}

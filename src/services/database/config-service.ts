import { db } from '@/lib/postgres';
import { configs } from '@/lib/postgres/schema';
import type { Config } from '@/lib/postgres/types';
import { eq } from 'drizzle-orm';

export class ConfigService {
    static async getConfig(): Promise<Config | null> {
        const result = await db.select().from(configs).where(eq(configs.id, 1));
        return result.length > 0 ? result[0] : null;
    }
}

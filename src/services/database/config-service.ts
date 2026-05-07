import { db } from '@/db';
import { configs } from '@/db/schema';
import type { Config } from '@/db/types';
import { eq } from 'drizzle-orm';

export class ConfigService {
    static async getConfig(): Promise<Config | null> {
        const result = await db.select().from(configs).where(eq(configs.id, 1));
        return result.length > 0 ? result[0] : null;
    }
}

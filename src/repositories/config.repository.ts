import { db } from '@/db';
import { configs } from '@/db/schema';
import type { Config, NewConfig } from '@/db/types';
import { redis } from '@/lib/redis';
import { eq } from 'drizzle-orm';

const CONFIG_ID = 1;

export class ConfigRepository {
    static async upsert(data: NewConfig): Promise<Config> {
        const [row] = await db
            .insert(configs)
            .values({ id: CONFIG_ID, ...data })
            .onConflictDoUpdate({ target: configs.id, set: data })
            .returning();
        await redis.set('config', JSON.stringify(row));
        return row;
    }
    static async get(): Promise<Config | null> {
        const cached = await redis.get('config');
        if (cached) return JSON.parse(cached) as Config;
        const [row] = await db.select().from(configs).where(eq(configs.id, CONFIG_ID)).limit(1);
        if (row) await redis.set('config', JSON.stringify(row));
        return row ?? null;
    }
    static async update(data: Partial<NewConfig>): Promise<Config | null> {
        const [row] = await db.update(configs).set(data).where(eq(configs.id, CONFIG_ID)).returning();
        if (row) await redis.set('config', JSON.stringify(row));
        return row ?? null;
    }
    static async invalidateCache(): Promise<void> {
        await redis.del('config');
    }
}

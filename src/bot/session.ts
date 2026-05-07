import { redis } from '@/lib/redis';
import { StorageAdapter } from 'grammy';

export class RedisStorage<T> implements StorageAdapter<T> {
    async read(key: string): Promise<T | undefined> {
        const data = await redis.get(`session:${key}`);
        if (!data) return undefined;
        return JSON.parse(data) as T;
    }
    async write(key: string, value: T): Promise<void> {
        await redis.set(`session:${key}`, JSON.stringify(value), 'EX', 300);
    }
    async delete(key: string): Promise<void> {
        await redis.del(`session:${key}`);
    }
    static async invalidate(key: string): Promise<void> {
        await redis.del(`session:${key}`);
    }
}

import { envConfig } from '@/config';
import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const conn = postgres({
    host: envConfig.db.host,
    port: envConfig.db.port,
    username: envConfig.db.username,
    password: envConfig.db.password,
    database: envConfig.db.database,
    max: envConfig.db.maxConnections,
    idle_timeout: envConfig.db.idleTimeout,
});

export const db = drizzle(conn, { schema });

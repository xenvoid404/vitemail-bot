import dbConf from '@/config/database';
import * as schema from '@/lib/postgres/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const conn = postgres({
    host: dbConf.postgres.host,
    port: dbConf.postgres.port,
    username: dbConf.postgres.username,
    password: dbConf.postgres.password,
    database: dbConf.postgres.database,
    max: 20,
    idle_timeout: 30,
});

export const db = drizzle(conn, { schema });

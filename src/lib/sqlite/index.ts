import envConf from '@/config/env';
import * as schema from '@/lib/sqlite/schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
    url: envConf.sqlite.url,
});

export const db = drizzle(client, { schema });

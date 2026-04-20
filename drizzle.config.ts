import { defineConfig } from 'drizzle-kit';

try {
    process.loadEnvFile();
} catch (err) {}

export default defineConfig({
    schema: './src/lib/postgres/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_DATABASE as string,
        ssl: false,
    },
    verbose: true,
    strict: true,
});

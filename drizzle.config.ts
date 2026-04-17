import { defineConfig } from 'drizzle-kit';

try {
    process.loadEnvFile();
} catch (err) {}

export default defineConfig({
    schema: './src/lib/sqlite/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.SQLITE_URL as string,
    },
});

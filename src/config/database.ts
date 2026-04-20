export default {
    postgres: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_DATABASE || 'unknown',
        username: process.env.DB_USERNAME || 'unknown',
        password: process.env.DB_PASSWORD || 'unknown',
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASSWORD || undefined,
        port: Number(process.env.REDIS_PORT) || 6379,
        prefix: process.env.REDIS_PREFIX,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    },
};

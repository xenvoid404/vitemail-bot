export const envConfig = {
    app: {
        name: process.env.APP_NAME || 'My App',
        env: process.env.APP_ENV || 'local',
        key: process.env.APP_KEY || 'changeme',
        url: process.env.APP_URL || 'http://127.0.0.1/3000',
        port: Number(process.env.APP_PORT) || 3000,
    },
    log: {
        level: process.env.LOG_LEVEL || 'debug',
        dir: process.env.LOG_DIR || 'logs',
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        retention: process.env.LOG_RETENTION || '3d',
    },
    db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_DATABASE || 'public',
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 20,
        idleTimeout: Number(process.env.DB_IDLE_TIMEOUT) || 30,
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASSWORD || '',
        port: Number(process.env.REDIS_PORT) || 6379,
        keyPrefix: process.env.REDIS_PREFIX || 'myapp:',
    },
    telegram: {
        apiRoot: process.env.TELEGRAM_API_ROOT || 'http://127.0.0.1:8081',
        botToken: process.env.TELEGRAM_BOT_TOKEN || 'changeme',
    },
};

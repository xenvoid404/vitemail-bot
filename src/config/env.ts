export default {
    app: {
        env: process.env.APP_ENV || 'development',
        key: process.env.APP_KEY || 'unknown',
        url: process.env.APP_URL || 'http://127.0.0.1:3000',
        port: Number(process.env.APP_PORT) || 3000,
    },
    log: {
        level: process.env.LOG_LEVEL || 'debug',
        dir: process.env.LOG_DIR || 'log',
        retention: `${process.env.LOG_RETENTION}d` || '3d',
        maxSize: `${process.env.LOG_MAXSIZE}m` || '20m',
    },
    telegram: {
        apiRoot: process.env.TELEGRAM_API_ROOT || 'http://127.0.0.1:8081',
        botToken: process.env.TELEGRAM_BOT_TOKEN || 'unknown',
    },
};

export default {
    env: process.env.APP_ENV || 'development',
    key: process.env.APP_KEY || 'unknown',
    url: process.env.APP_URL || 'http://127.0.0.1:3000',
    port: Number(process.env.APP_PORT) || 3000,
};

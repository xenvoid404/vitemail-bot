export default {
    level: process.env.LOG_LEVEL || 'debug',
    dir: process.env.LOG_DIR || 'log',
    retention: `${process.env.LOG_RETENTION}d` || '3d',
    maxSize: `${process.env.LOG_MAXSIZE}m` || '20m',
};

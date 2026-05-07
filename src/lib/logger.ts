import { envConfig } from '@/config';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

const logFormat = printf(({ level, message, label = 'App', timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] [${label}]: ${message}${metaStr}${stack ? `\n${stack}` : ''}`;
});

const winstonLogger = winston.createLogger({
    level: envConfig.log.level,
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), splat(), logFormat),
    transports: [
        new winston.transports.Console({
            format: combine(colorize({ all: true }), logFormat),
        }),
        new DailyRotateFile({
            dirname: path.join(process.cwd(), envConfig.log.dir),
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: envConfig.log.maxSize,
            maxFiles: envConfig.log.retention,
            level: envConfig.log.level,
        }),
    ],
});

export const logger = {
    info: (label: string, message: unknown, meta?: object) => winstonLogger.info(String(message), { label, ...meta }),
    warn: (label: string, message: unknown, meta?: object) => winstonLogger.warn(String(message), { label, ...meta }),
    error: (label: string, err: unknown, meta?: object) => {
        if (err instanceof Error) {
            winstonLogger.error(err.message, { label, stack: err.stack, ...meta });
        } else {
            winstonLogger.error(String(err), { label, ...meta });
        }
    },
    debug: (label: string, message: unknown, meta?: object) => winstonLogger.debug(String(message), { label, ...meta }),
};

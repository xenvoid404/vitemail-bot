import envConf from '@/config/env';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

const myFormat = printf(({ level, message, label = 'App', timestamp, stack, ...metadata }) => {
    const metaString = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] [${level}] [${label}]: ${message}${metaString}${stack ? `\n${stack}` : ''}`;
});

const winstonLogger = winston.createLogger({
    level: envConf.log.level || 'info',
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), splat(), myFormat),
    transports: [
        new winston.transports.Console({
            format: combine(colorize({ all: true }), myFormat),
        }),
        new DailyRotateFile({
            dirname: path.join(process.cwd(), envConf.log.dir),
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: envConf.log.maxSize,
            maxFiles: envConf.log.retention,
            level: envConf.log.level,
        }),
    ],
});

export const logger = {
    info: (label: string, message: any, meta?: any) => winstonLogger.info(message, { label, ...meta }),
    warn: (label: string, message: any, meta?: any) => winstonLogger.warn(message, { label, ...meta }),
    error: (label: string, message: any, meta?: any) => {
        if (message instanceof Error) {
            winstonLogger.error(message.message, { label, stack: message.stack, ...meta });
        } else {
            winstonLogger.error(message, { label, ...meta });
        }
    },
    debug: (label: string, message: any, meta?: any) => winstonLogger.debug(message, { label, ...meta }),
};

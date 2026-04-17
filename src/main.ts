import { setupBot } from '@/app/bot';
import { bot } from '@/app/bot/instance';
import { createServer } from '@/app/http';
import envConf from '@/config/env';
import { logger } from '@/lib/utils/logger';

const startApp = async () => {
    try {
        setupBot();
        logger.info('main.ts', 'Logic bot successfully loaded');

        const api = createServer();
        const server = api.listen(envConf.app.port, async () => {
            logger.info('main.ts', `HTTP Server running on port ${envConf.app.port}`);

            await bot.start({
                onStart: (botInfo) => {
                    logger.info('main.ts', `Bot @${botInfo.username} berhasil terhubung!`);
                },
            });
        });

        const shutdown = async (signal: string) => {
            logger.info('main.ts', `Signal ${signal} received, shutting down the system...`);

            server.close(async () => {
                logger.info('main.ts', 'HTTP Server is closed');
                await bot.stop();
                logger.info('main.ts', 'Bot connection closed');
                process.exit(0);
            });
        };

        process.once('SIGINT', () => shutdown('SIGINT'));
        process.once('SIGTERM', () => shutdown('SIGTERM'));
    } catch (err) {
        logger.error('main.ts', err);
        process.exit(1);
    }
};

startApp();

import { setupBot } from '@/app/bot';
import { bot } from '@/app/bot/instance';
import { createServer } from '@/app/http';
import appConf from '@/config/app';
import { setupJobs } from '@/jobs';
import { logger } from '@/lib/utils/logger';

async function bootstrap() {
    try {
        setupBot();
        logger.info('main.ts', 'Bot berhasil dimuat');

        const api = createServer();
        const server = api.listen(appConf.port, async () => {
            logger.info('main.ts', `HTTP Server berjalan di port ${appConf.port}`);

            await bot.start({
                onStart: (botInfo) => {
                    logger.info('main.ts', `Bot @${botInfo.username} berhasil terhubung!`);
                },
            });
        });

        setupJobs();

        const shutdown = async (signal: string) => {
            logger.info('main.ts', `Signal ${signal} diterima, mematikan sistem...`);

            server.close(async () => {
                logger.info('main.ts', 'HTTP Server ditutup');
                await bot.stop();
                logger.info('main.ts', 'Koneksi bot ditutup');
                process.exit(0);
            });
        };

        process.once('SIGINT', () => shutdown('SIGINT'));
        process.once('SIGTERM', () => shutdown('SIGTERM'));
    } catch (err) {
        logger.error('main.ts', err);
        process.exit(1);
    }
}

bootstrap();

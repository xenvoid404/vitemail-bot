import { route } from '@/app/http/route';
import type { Express } from 'express';
import express from 'express';

export const createServer = (): Express => {
    const api = express();
    api.set('trust proxy', 1);
    api.use(express.json());
    api.use(express.urlencoded({ extended: true }));

    api.use('/api', route);

    return api;
};

import dbConf from '@/config/database';
import { Redis } from 'ioredis';

export const redis = new Redis(dbConf.redis);

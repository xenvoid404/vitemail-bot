import envConf from '@/config/env';
import { Redis } from 'ioredis';

export const redis = new Redis(envConf.redis);

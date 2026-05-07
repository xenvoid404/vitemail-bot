import { envConfig } from '@/config';
import { Redis } from 'ioredis';

export const redis = new Redis(envConfig.redis);

import Redis from 'ioredis';

import { config } from './index';
import { logger } from '../shared/utils/logger';

const globalForRedis = globalThis as unknown as { redis?: Redis };

export const redisClient =
  globalForRedis.redis ??
  new Redis(config.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    enableAutoPipelining: true,
  });

if (config.env !== 'production') {
  globalForRedis.redis = redisClient;
}

redisClient.on('error', (error) => {
  logger.error('Redis error', { error: error.message });
});

export const connectRedis = async (): Promise<void> => {
  if (redisClient.status === 'wait') {
    await redisClient.connect();
  }
  logger.info('Redis connection established');
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient.status === 'ready' || redisClient.status === 'connect') {
    await redisClient.quit();
  }
  logger.info('Redis connection closed');
};

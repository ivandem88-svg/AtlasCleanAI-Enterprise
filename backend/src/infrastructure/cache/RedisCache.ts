import { redisClient } from '../../config/redis';

export class RedisCache {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.set(key, payload, 'EX', ttlSeconds);
      return;
    }
    await redisClient.set(key, payload);
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

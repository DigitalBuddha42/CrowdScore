import { Redis } from 'ioredis';

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error('REDIS_URL is not defined');
};

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Redis event handlers
redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('Redis Client Connected');
});

redis.on('ready', () => {
  console.log('Redis Client Ready');
});

// Helper functions for pub/sub
export const publish = async (channel: string, message: string) => {
  try {
    await redis.publish(channel, message);
  } catch (error) {
    console.error('Redis Publish Error:', error);
    throw error;
  }
};

export const subscribe = async (channel: string, callback: (message: string) => void) => {
  try {
    const subscriber = redis.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on('message', (_, message) => callback(message));
    return subscriber;
  } catch (error) {
    console.error('Redis Subscribe Error:', error);
    throw error;
  }
}; 
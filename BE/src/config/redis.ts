import { createClient } from 'redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Redis: Too many reconnection attempts, giving up');
        return new Error('Redis reconnection failed');
      }
      return retries * 100; // Exponential backoff
    }
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('ready', () => console.log('✅ Redis ready'));

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

/**
 * Set value in Redis with expiration
 */
export async function setCache(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('Redis setCache error:', error);
  }
}

/**
 * Get value from Redis
 */
export async function getCache(key: string): Promise<any | null> {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis getCache error:', error);
    return null;
  }
}

/**
 * Delete key from Redis
 */
export async function delCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Redis delCache error:', error);
  }
}

/**
 * Delete multiple keys by pattern
 */
export async function delCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis delCachePattern error:', error);
  }
}

/**
 * Rate limiting: Check if user exceeded request limit
 */
export async function checkRateLimit(
  userId: number,
  action: string,
  maxRequests: number = 10,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const key = `ratelimit:${action}:${userId}`;
    const current = await redisClient.get(key);
    
    if (!current) {
      // First request in window
      await redisClient.setEx(key, windowSeconds, '1');
      return { allowed: true, remaining: maxRequests - 1 };
    }
    
    const count = parseInt(current);
    if (count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }
    
    await redisClient.incr(key);
    return { allowed: true, remaining: maxRequests - count - 1 };
  } catch (error) {
    console.error('Redis checkRateLimit error:', error);
    // On error, allow request (fail-open)
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Increment counter (for analytics)
 */
export async function incrementCounter(key: string, ttlSeconds?: number): Promise<number> {
  try {
    const count = await redisClient.incr(key);
    if (ttlSeconds && count === 1) {
      await redisClient.expire(key, ttlSeconds);
    }
    return count;
  } catch (error) {
    console.error('Redis incrementCounter error:', error);
    return 0;
  }
}

export { redisClient };

import Redis from 'ioredis';

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
};

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (!redis) redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1, lazyConnect: true });
  return redis;
}

export async function rateLimit(key: string, limit = 12, windowSeconds = 60): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = now + windowSeconds * 1000;
  const client = getRedis();

  if (client) {
    try {
      const redisKey = `rl:${key}`;
      const count = await client.incr(redisKey);
      if (count === 1) await client.expire(redisKey, windowSeconds);
      const ttl = await client.ttl(redisKey);
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetAt: new Date(now + Math.max(ttl, 0) * 1000),
      };
    } catch {
      // Fall through to memory limiter when Redis is unavailable.
    }
  }

  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt: new Date(resetAt) };
  }
  bucket.count += 1;
  return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count), resetAt: new Date(bucket.resetAt) };
}

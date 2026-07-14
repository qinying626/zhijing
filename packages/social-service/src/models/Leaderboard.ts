import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redis.on('error', (err) => console.error('Redis Client Error', err));

let connected = false;

export async function getRedisClient() {
  if (!connected) {
    await redis.connect();
    connected = true;
  }
  return redis;
}

export async function updateLeaderboard(type: string, userId: string, score: number): Promise<void> {
  const client = await getRedisClient();
  const key = `leaderboard:${type}`;
  await client.zAdd(key, { value: userId, score });
}

export async function getLeaderboard(type: string, limit = 50): Promise<{ rank: number; id: string; score: number }[]> {
  const client = await getRedisClient();
  const key = `leaderboard:${type}`;
  const top = await client.zRangeWithScores(key, 0, limit - 1, { REV: true });
  return top.map((entry, index) => ({
    rank: index + 1,
    id: entry.value,
    score: entry.score,
  }));
}

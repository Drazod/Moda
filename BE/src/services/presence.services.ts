import { redisClient } from '../config/redis';

// How long a connection is considered "online" without a new heartbeat (seconds)
const TTL_SECONDS = Number(process.env.PRESENCE_TTL_SECONDS || 60);

// Keys will look like: presence:user:123, presence:guest:gid_xxx
const keyUser = (id: number | string) => `presence:user:${id}`;
const keyGuest = (gid: string) => `presence:guest:${gid}`;

// record a heartbeat (sets/refreshes TTL)
export async function recordHeartbeat(params: { userId?: number | string; guestId?: string }) {
  if (params.userId != null) {
    await redisClient.setEx(keyUser(params.userId), TTL_SECONDS, '1');
  } else if (params.guestId) {
    await redisClient.setEx(keyGuest(params.guestId), TTL_SECONDS, '1');
  }
}

// counts by scanning keys. Fine for small/medium scale.
// For very large scale, switch to a rolling Set/ZSET with periodic cleanup.
async function countKeys(pattern: string): Promise<number> {
  try {
    const keys = await redisClient.keys(pattern);
    return keys.length;
  } catch (error) {
    console.error('Error counting keys:', error);
    return 0;
  }
}

export async function getPresenceCounts() {
  const [customersOnline, guestsOnline] = await Promise.all([
    countKeys('presence:user:*'),
    countKeys('presence:guest:*'),
  ]);
  const totalConnects = customersOnline + guestsOnline;

  // optional “load” estimate vs a capacity you define
  const capacity = Number(process.env.MAX_EXPECTED_CONNECTIONS || 1000);
  const webLoadPct = capacity > 0 ? Math.min(100, Math.round((totalConnects / capacity) * 100)) : null;

  return { customersOnline, guestsOnline, totalConnects, webLoadPct };
}

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// How long a connection is considered “online” without a new heartbeat (seconds)
const TTL_SECONDS = Number(process.env.PRESENCE_TTL_SECONDS || 60);

// Keys will look like: presence:user:123, presence:guest:gid_xxx
const keyUser = (id: number | string) => `presence:user:${id}`;
const keyGuest = (gid: string) => `presence:guest:${gid}`;

// record a heartbeat (sets/refreshes TTL)
export async function recordHeartbeat(params: { userId?: number | string; guestId?: string }) {
  if (params.userId != null) {
    await redis.set(keyUser(params.userId), '1', 'EX', TTL_SECONDS);
  } else if (params.guestId) {
    await redis.set(keyGuest(params.guestId), '1', 'EX', TTL_SECONDS);
  }
}

// counts by scanning keys. Fine for small/medium scale.
// For very large scale, switch to a rolling Set/ZSET with periodic cleanup.
async function countKeys(pattern: string): Promise<number> {
  let cursor = '0';
  let total = 0;
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 1000);
    total += keys.length;
    cursor = next;
  } while (cursor !== '0');
  return total;
}

export async function getPresenceCounts() {
  const [customersOnline, guestsOnline] = await Promise.all([
    countKeys('presence:user:*'),
    countKeys('presence:guest:*'),
  ]);
  const totalConnects = customersOnline + guestsOnline;

  // optional “load” estimate vs a capacity you define
  const capacity = Number(process.env.MAX_EXPECTED_CONNECTIONS || 100);
  const webLoadPct = capacity > 0 ? Math.min(100, Math.round((totalConnects / capacity) * 100)) : null;

  return { customersOnline, guestsOnline, totalConnects, webLoadPct };
}

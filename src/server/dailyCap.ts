/** The two KV calls the cap needs, so tests can pass a plain Map-backed fake. */
export type CapStore = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, options: { expirationTtl: number }) => Promise<void>;
};

/** Per visitor IP and for the whole site, per UTC day. The minute rate limit catches bursts; this catches slow drips. */
export const DAILY_LIMITS = { perIp: 10, total: 50 } as const;

const DAY_SECONDS = 86_400;

const count = async (store: CapStore, key: string) => Number((await store.get(key)) ?? 0) || 0;

/**
 * Counts one work order against today's caps and reports whether it may go out.
 * KV is eventually consistent and this is read-then-write, so two orders racing can both pass:
 * the cap is approximate, which is fine for a spam brake, not for billing.
 */
export const takeDailySlot = async (store: CapStore, ip: string | undefined, now = new Date()) => {
  const day = now.toISOString().slice(0, 10);
  const totalKey = `orders:${day}:total`;
  const ipKey = ip ? `orders:${day}:ip:${ip}` : undefined;
  const [total, perIp] = await Promise.all([count(store, totalKey), ipKey ? count(store, ipKey) : 0]);
  if (total >= DAILY_LIMITS.total || perIp >= DAILY_LIMITS.perIp) return false;
  // Two days, so a key written just before midnight UTC still covers the rest of its day.
  const options = { expirationTtl: 2 * DAY_SECONDS };
  await Promise.all([
    store.put(totalKey, String(total + 1), options),
    ipKey ? store.put(ipKey, String(perIp + 1), options) : undefined,
  ]);
  return true;
};

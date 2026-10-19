import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DAILY_LIMITS, takeDailySlot, type CapStore } from "./dailyCap.ts";

const fakeStore = () => {
  const data = new Map<string, string>();
  const store: CapStore = {
    get: async (key) => data.get(key) ?? null,
    put: async (key, value) => void data.set(key, value),
  };
  return { data, store };
};

/** Takes slots one after another, as real orders arrive: each read must see the previous write. */
const takeInTurn = (store: CapStore, ips: readonly string[], at: Date) =>
  ips.reduce<Promise<boolean[]>>(
    async (done, ip) => [...(await done), await takeDailySlot(store, ip, at)],
    Promise.resolve([]),
  );

const repeat = (ip: string, n: number) => Array.from({ length: n }, () => ip);

const day = new Date("2026-10-19T12:00:00Z");

void describe("takeDailySlot", () => {
  void it("lets an IP through up to its daily limit, then refuses", async () => {
    const { store } = fakeStore();
    assert.ok((await takeInTurn(store, repeat("1.2.3.4", DAILY_LIMITS.perIp), day)).every(Boolean));
    assert.equal(await takeDailySlot(store, "1.2.3.4", day), false);
    assert.equal(await takeDailySlot(store, "5.6.7.8", day), true);
  });

  void it("refuses everyone once the site-wide limit is reached", async () => {
    const { store } = fakeStore();
    const ips = Array.from({ length: DAILY_LIMITS.total }, (_, i) => `10.0.0.${i}`);
    assert.ok((await takeInTurn(store, ips, day)).every(Boolean));
    assert.equal(await takeDailySlot(store, "1.2.3.4", day), false);
  });

  void it("starts counting again on the next UTC day", async () => {
    const { store } = fakeStore();
    await takeInTurn(store, repeat("1.2.3.4", DAILY_LIMITS.perIp), day);
    assert.equal(await takeDailySlot(store, "1.2.3.4", new Date("2026-10-20T00:00:01Z")), true);
  });

  void it("counts orders without an IP against the site-wide limit only", async () => {
    const { data, store } = fakeStore();
    assert.equal(await takeDailySlot(store, undefined, day), true);
    assert.deepEqual([...data.keys()], ["orders:2026-10-19:total"]);
  });
});

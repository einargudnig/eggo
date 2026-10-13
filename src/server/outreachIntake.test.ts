import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import type { HubEvent } from "./hubLog.ts";
import { sendToOutreach } from "./outreachIntake.ts";
import type { WorkOrder } from "./workOrder.ts";

const order: WorkOrder = { name: "Gunna", email: "gunna@lagnir.is", message: "Hæ", parts: [], lang: "is" };
const env = { OUTREACH_INTAKE_TOKEN: "tok", OUTREACH_URL: "https://outreach.test" };
const realFetch = globalThis.fetch;

void describe("sendToOutreach", () => {
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  void it("posts the order with its ticket and the bearer token", async () => {
    let request: Request | undefined;
    globalThis.fetch = async (input, init) => {
      request = new Request(input, init);
      return new Response("{}", { status: 201 });
    };
    await sendToOutreach(order, "VB-2026-0042", "api", env, async () => assert.fail("nothing to log"));
    assert.equal(request?.url, "https://outreach.test/api/intake/work-order");
    assert.equal(request?.headers.get("authorization"), "Bearer tok");
    assert.deepEqual(await request?.json(), { ...order, ticket: "VB-2026-0042", channel: "api" });
  });

  void it("never throws when outreach is down, slow or refuses, and logs it", async () => {
    const logged: HubEvent[] = [];
    const log = async (event: HubEvent) => void logged.push(event);
    globalThis.fetch = async () => {
      throw new Error("network down");
    };
    await sendToOutreach(order, "VB-1", "form", env, log);
    globalThis.fetch = async () => {
      throw new DOMException("timed out", "TimeoutError");
    };
    await sendToOutreach(order, "VB-2", "form", env, log);
    globalThis.fetch = async () => new Response("no", { status: 401 });
    await sendToOutreach(order, "VB-3", "form", env, log);
    assert.deepEqual(
      logged.map((e) => [e.event, e.fields?.ticket]),
      [
        ["outreach_intake_failed", "VB-1"],
        ["outreach_intake_failed", "VB-2"],
        ["outreach_intake_failed", "VB-3"],
      ],
    );
  });

  void it("does nothing without a token", async () => {
    globalThis.fetch = async () => assert.fail("must not call outreach");
    await sendToOutreach(order, "VB-1", "form", {}, async () => undefined);
  });
});

/**
 * Pushes new mail in the Spacemail inbox (eggo@eggo.is) to ntfy, checked once a minute.
 * Deployed by alchemy.run.ts as its own Worker. Spacemail stays the inbox; this only reads it.
 */
import { connect } from "cloudflare:sockets";
import { checkInbox } from "./check.ts";
import type { Notification } from "./mail.ts";

export type InboxEnv = {
  IMAP_HOST: string;
  IMAP_USER: string;
  IMAP_PASSWORD: string;
  NTFY_TOPIC: string;
};

const push = async (topic: string, note: Notification) => {
  // JSON publishing, because ntfy's header API can't carry Icelandic characters in the title.
  const res = await fetch("https://ntfy.sh/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ topic, ...note }),
  });
  if (!res.ok) throw new Error(`ntfy ${res.status}: ${await res.text()}`);
};

export default {
  async scheduled(controller: ScheduledController, env: InboxEnv) {
    const socket = connect(
      { hostname: env.IMAP_HOST, port: 993 },
      { secureTransport: "on", allowHalfOpen: false },
    );
    try {
      const count = await checkInbox(
        socket,
        { user: env.IMAP_USER, password: env.IMAP_PASSWORD, now: new Date(controller.scheduledTime) },
        (note) => push(env.NTFY_TOPIC, note),
      );
      if (count > 0) console.log(`inbox: pushed ${count}`);
    } catch (error) {
      console.error("inbox check failed", error);
      // A broken check must not fail silently, but once an hour is enough to say so.
      if (new Date(controller.scheduledTime).getUTCMinutes() !== 0) return;
      await push(env.NTFY_TOPIC, {
        title: "Inbox alerts are not working",
        message: error instanceof Error ? error.message : String(error),
        priority: 4,
        tags: ["warning"],
      }).catch(() => undefined);
    }
  },
} satisfies ExportedHandler<InboxEnv>;

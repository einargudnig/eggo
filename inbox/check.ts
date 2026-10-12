import { type Duplex, openSession } from "./imap.ts";
import { imapDate, type Notification, parseSearch, quote, toNotification } from "./mail.ts";

/** Custom IMAP keyword set on every message we've pushed, so each one is announced once. */
export const KEYWORD = "EggoNotified";
/** More than this in one minute is a burst; the rest go out on the next run. */
const BATCH = 10;
const DAY = 24 * 60 * 60 * 1000;

export type InboxConfig = { user: string; password: string; now: Date };

/**
 * One pass over the inbox: unread mail from the last day that hasn't been pushed yet.
 * Reading in webmail first (\Seen) counts as "already know". Headers are read with BODY.PEEK so
 * nothing gets marked as read. The keyword is set only after `notify` succeeds, so a failed push
 * retries next minute instead of being lost.
 */
export const checkInbox = async (
  socket: Duplex,
  config: InboxConfig,
  notify: (note: Notification) => Promise<void>,
) => {
  const imap = openSession(socket);
  try {
    await imap.greeting();
    await imap.run(`LOGIN ${quote(config.user)} ${quote(config.password)}`, "LOGIN");
    const selected = await imap.run("SELECT INBOX");
    const flags = selected.find((r) => r.text.includes("PERMANENTFLAGS"))?.text ?? "";
    if (!flags.includes("\\*")) throw new Error("Mailbox doesn't allow custom keywords");

    const since = imapDate(new Date(config.now.getTime() - DAY));
    const found = await imap.run(`UID SEARCH UNSEEN UNKEYWORD ${KEYWORD} SINCE ${since}`);
    const uids = parseSearch(found.map((r) => r.text)).slice(0, BATCH);
    if (uids.length === 0) return 0;

    const fetched = await imap.run(
      `UID FETCH ${uids.join(",")} (UID BODY.PEEK[HEADER.FIELDS (FROM SUBJECT)])`,
    );
    const sent: number[] = [];
    for (const { text, literals } of fetched) {
      const uid = /UID (\d+)/.exec(text)?.[1];
      if (!uid || literals[0] === undefined) continue;
      await notify(toNotification(literals[0], config.user));
      sent.push(Number(uid));
    }
    if (sent.length > 0) await imap.run(`UID STORE ${sent.join(",")} +FLAGS.SILENT (${KEYWORD})`);
    return sent.length;
  } finally {
    await imap.close().catch(() => undefined);
  }
};

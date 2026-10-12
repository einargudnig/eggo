/** Pure helpers for turning IMAP header blocks into phone notifications. No I/O here, so it's unit-tested. */

export type Notification = { title: string; message: string; priority: 3 | 4; tags: string[] };

/** RFC 2047 encoded words (`=?UTF-8?B?…?=`), which is how most mailers send Icelandic subjects and names. */
export const decodeWords = (value: string) =>
  value
    // Whitespace between two adjacent encoded words is not part of the text.
    .replace(/(=\?[^?]+\?[bq]\?[^?]*\?=)\s+(?==\?)/gi, "$1")
    .replace(/=\?([^?]+)\?([bq])\?([^?]*)\?=/gi, (word, charset: string, encoding: string, text: string) => {
      try {
        const bytes =
          encoding.toLowerCase() === "b"
            ? Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
            : Uint8Array.from(
                text
                  .replace(/_/g, " ")
                  .replace(/=([0-9a-f]{2})/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16))),
                (c) => c.charCodeAt(0),
              );
        return new TextDecoder(charset).decode(bytes);
      } catch {
        return word;
      }
    });

/** Unfolds continuation lines and returns lower-cased header names mapped to decoded values. */
export const parseHeaders = (raw: string) => {
  const headers = new Map<string, string>();
  for (const line of raw.replace(/\r?\n[ \t]+/g, " ").split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    headers.set(line.slice(0, colon).trim().toLowerCase(), decodeWords(line.slice(colon + 1).trim()));
  }
  return headers;
};

/** `"Jón Jónsson" <jon@x.is>` → `Jón Jónsson`; a bare address stays an address. */
export const senderName = (from: string) => {
  const match = /^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/.exec(from);
  if (!match) return from.trim();
  const [, name = "", address = ""] = match;
  return name.trim() || address.trim();
};

/** Work orders from the site's form, API and MCP server go through `deliverWorkOrder` with this prefix. */
const WORK_ORDER = /^Verkbeiðni /;

export const toNotification = (raw: string, mailbox: string): Notification => {
  const headers = parseHeaders(raw);
  const subject = headers.get("subject") || "(no subject)";
  const from = senderName(headers.get("from") ?? "") || "Unknown sender";
  const isOrder = WORK_ORDER.test(subject);
  return {
    title: isOrder ? `Work order · ${from}` : `${from} → ${mailbox}`,
    message: subject,
    priority: isOrder ? 4 : 3,
    tags: [isOrder ? "briefcase" : "email"],
  };
};

/** IMAP quoted string. Passwords with quotes or backslashes are escaped, not truncated. */
export const quote = (value: string) => `"${value.replace(/[\\"]/g, "\\$&")}"`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** IMAP SEARCH date (`11-Oct-2026`), in UTC. */
export const imapDate = (date: Date) =>
  `${date.getUTCDate()}-${MONTHS[date.getUTCMonth()]}-${date.getUTCFullYear()}`;

/** `* SEARCH 4 9 12` → `[4, 9, 12]`. */
export const parseSearch = (lines: readonly string[]) =>
  lines
    .filter((line) => line.startsWith("* SEARCH"))
    .flatMap((line) => line.slice("* SEARCH".length).trim().split(/\s+/))
    .filter((n) => n !== "")
    .map(Number);

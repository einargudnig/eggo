import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkInbox, KEYWORD } from "./check.ts";
import type { Duplex } from "./imap.ts";
import {
  decodeWords,
  imapDate,
  type Notification,
  parseSearch,
  quote,
  senderName,
  toNotification,
} from "./mail.ts";

void describe("mail helpers", () => {
  void it("decodes base64 and quoted-printable encoded words, joining adjacent ones", () => {
    assert.equal(decodeWords("=?UTF-8?B?VmVya2JlacOwbmk=?="), "Verkbeiðni");
    assert.equal(decodeWords("=?utf-8?Q?J=C3=B3n_J=C3=B3nsson?="), "Jón Jónsson");
    assert.equal(decodeWords("=?UTF-8?Q?Ver?= =?UTF-8?Q?kbei=C3=B0ni?= fyrir"), "Verkbeiðni fyrir");
    assert.equal(decodeWords("Plain subject"), "Plain subject");
  });

  void it("names the sender, falling back to the address", () => {
    assert.equal(senderName('"Jón Jónsson" <jon@example.is>'), "Jón Jónsson");
    assert.equal(senderName("<jon@example.is>"), "jon@example.is");
    assert.equal(senderName("jon@example.is"), "jon@example.is");
  });

  void it("raises work orders above ordinary mail", () => {
    const order = toNotification(
      "From: Eggó <vefur@eggo.is>\r\nSubject: Verkbeiðni VB-2026-0042 frá Gunna\r\n",
      "eggo@eggo.is",
    );
    assert.deepEqual(order, {
      title: "Work order · Eggó",
      message: "Verkbeiðni VB-2026-0042 frá Gunna",
      priority: 4,
      tags: ["briefcase"],
    });
    const mail = toNotification("Subject: Spurning\r\n\tum verð\r\nFrom: a@b.is\r\n", "eggo@eggo.is");
    assert.equal(mail.title, "a@b.is → eggo@eggo.is");
    assert.equal(mail.message, "Spurning um verð");
    assert.equal(mail.priority, 3);
  });

  void it("formats IMAP arguments", () => {
    assert.equal(quote('pa"ss\\word'), '"pa\\"ss\\\\word"');
    assert.equal(imapDate(new Date("2026-10-11T23:59:00Z")), "11-Oct-2026");
    assert.deepEqual(parseSearch(["* SEARCH 4 9 12"]), [4, 9, 12]);
    assert.deepEqual(parseSearch(["* SEARCH"]), []);
  });
});

/** A scripted IMAP server on in-memory streams: `reply` maps each command to its untagged lines. */
const fakeServer = (reply: (command: string) => string[] | Error) => {
  const commands: string[] = [];
  const encoder = new TextEncoder();
  let push: ((text: string) => void) | undefined;
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      push = (text) => controller.enqueue(encoder.encode(text));
      push("* OK Dovecot ready.\r\n");
    },
  });
  let pending = "";
  const writable = new WritableStream<Uint8Array>({
    write(chunk) {
      pending += new TextDecoder().decode(chunk);
      for (let end = pending.indexOf("\r\n"); end >= 0; end = pending.indexOf("\r\n")) {
        const line = pending.slice(0, end);
        pending = pending.slice(end + 2);
        const [tag = "", ...rest] = line.split(" ");
        const command = rest.join(" ");
        commands.push(command);
        const result = reply(command);
        if (result instanceof Error) push?.(`${tag} NO ${result.message}\r\n`);
        else push?.(`${result.map((l) => `${l}\r\n`).join("")}${tag} OK done\r\n`);
      }
    },
  });
  const socket: Duplex = { readable, writable, close: async () => undefined };
  return { socket, commands };
};

const header = "From: =?UTF-8?Q?J=C3=B3n?= <jon@example.is>\r\nSubject: Halló\r\n\r\n";
const literal = (text: string) => `{${new TextEncoder().encode(text).length}}\r\n${text}`;
const config = { user: "eggo@eggo.is", password: "secret", now: new Date("2026-10-12T10:00:00Z") };

void describe("checkInbox", () => {
  void it("pushes new mail once, then tags it", async () => {
    const { socket, commands } = fakeServer((command) => {
      if (command.startsWith("SELECT")) return ["* FLAGS (\\Seen)", "* OK [PERMANENTFLAGS (\\Seen \\*)] Ok"];
      if (command.startsWith("UID SEARCH")) return ["* SEARCH 7"];
      if (command.startsWith("UID FETCH"))
        return [`* 3 FETCH (UID 7 BODY[HEADER.FIELDS (FROM SUBJECT)] ${literal(header)})`];
      return [];
    });
    const sent: Notification[] = [];
    const count = await checkInbox(socket, config, async (note) => void sent.push(note));

    assert.equal(count, 1);
    assert.deepEqual(sent, [{ title: "Jón → eggo@eggo.is", message: "Halló", priority: 3, tags: ["email"] }]);
    assert.ok(commands.includes(`UID SEARCH UNSEEN UNKEYWORD ${KEYWORD} SINCE 11-Oct-2026`));
    assert.ok(commands.includes(`UID STORE 7 +FLAGS.SILENT (${KEYWORD})`));
    assert.ok(
      commands.some((c) => c.includes("BODY.PEEK")),
      "reading headers must not mark mail as read",
    );
  });

  void it("leaves mail untagged when the push fails, so the next run retries", async () => {
    const { socket, commands } = fakeServer((command) => {
      if (command.startsWith("SELECT")) return ["* OK [PERMANENTFLAGS (\\*)] Ok"];
      if (command.startsWith("UID SEARCH")) return ["* SEARCH 7"];
      if (command.startsWith("UID FETCH"))
        return [`* 3 FETCH (UID 7 BODY[HEADER.FIELDS (FROM SUBJECT)] ${literal(header)})`];
      return [];
    });
    await assert.rejects(
      checkInbox(socket, config, async () => {
        throw new Error("ntfy down");
      }),
      /ntfy down/,
    );
    assert.ok(!commands.some((c) => c.startsWith("UID STORE")));
    assert.equal(commands.at(-1), "LOGOUT");
  });

  void it("tags what was pushed before a later push fails, so it isn't announced twice", async () => {
    const { socket, commands } = fakeServer((command) => {
      if (command.startsWith("SELECT")) return ["* OK [PERMANENTFLAGS (\\*)] Ok"];
      if (command.startsWith("UID SEARCH")) return ["* SEARCH 7 8"];
      if (command.startsWith("UID FETCH"))
        return [
          `* 3 FETCH (UID 7 BODY[HEADER.FIELDS (FROM SUBJECT)] ${literal(header)})`,
          `* 4 FETCH (UID 8 BODY[HEADER.FIELDS (FROM SUBJECT)] ${literal(header)})`,
        ];
      return [];
    });
    let calls = 0;
    await assert.rejects(
      checkInbox(socket, config, async () => {
        calls += 1;
        if (calls === 2) throw new Error("ntfy down");
      }),
      /ntfy down/,
    );
    assert.ok(commands.includes(`UID STORE 7 +FLAGS.SILENT (${KEYWORD})`));
  });

  void it("reports a failed login without echoing the password", async () => {
    const { socket } = fakeServer((command) =>
      command.startsWith("LOGIN") ? new Error("[AUTHENTICATIONFAILED] Authentication failed.") : [],
    );
    await assert.rejects(
      checkInbox(socket, config, async () => undefined),
      (error: Error) => {
        assert.match(error.message, /IMAP LOGIN failed/);
        assert.doesNotMatch(error.message, /secret/);
        return true;
      },
    );
  });
});

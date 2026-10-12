/**
 * Just enough IMAP4rev1 for one job: log in, find new mail, read two headers, tag it.
 * Works on any duplex byte stream, so the Worker passes a `cloudflare:sockets` TLS socket and the
 * tests pass an in-memory one.
 */

export type Duplex = {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close: () => Promise<void>;
};

/** One untagged response. Literals (`{123}` + bytes) are kept apart from the line text. */
export type Untagged = { text: string; literals: string[] };

const decoder = new TextDecoder();
const encoder = new TextEncoder();

/** Reads CRLF-terminated lines and exact-length literals from a byte stream. */
const createReader = (source: ReadableStreamDefaultReader<Uint8Array>) => {
  let buffer = new Uint8Array(0);

  const fill = async () => {
    const { value, done } = await source.read();
    if (done) throw new Error("IMAP connection closed");
    const next = new Uint8Array(buffer.length + value.length);
    next.set(buffer);
    next.set(value, buffer.length);
    buffer = next;
  };

  const take = (n: number) => {
    const out = buffer.slice(0, n);
    buffer = buffer.slice(n);
    return decoder.decode(out);
  };

  const line = async (): Promise<string> => {
    for (;;) {
      const end = buffer.findIndex((byte, i) => byte === 13 && buffer[i + 1] === 10);
      if (end >= 0) {
        const text = take(end);
        take(2);
        return text;
      }
      await fill();
    }
  };

  const bytes = async (n: number): Promise<string> => {
    while (buffer.length < n) await fill();
    return take(n);
  };

  return { line, bytes };
};

const LITERAL = /\{(\d+)\}$/;

export type ImapSession = ReturnType<typeof openSession>;

export const openSession = (socket: Duplex) => {
  const reader = createReader(socket.readable.getReader());
  const writer = socket.writable.getWriter();
  let tagCount = 0;

  /** One response, with any literals read out and replaced by `{index}` placeholders in the text. */
  const response = async (): Promise<Untagged> => {
    let text = await reader.line();
    const literals: string[] = [];
    for (let match = LITERAL.exec(text); match; match = LITERAL.exec(text)) {
      literals.push(await reader.bytes(Number(match[1])));
      text = `${text.slice(0, match.index)}{${literals.length - 1}}${await reader.line()}`;
    }
    return { text, literals };
  };

  /** The server speaks first. */
  const greeting = async () => {
    const line = await reader.line();
    if (!line.startsWith("* OK")) throw new Error(`Unexpected IMAP greeting: ${line}`);
  };

  /**
   * Sends one command and collects untagged responses until its tagged reply.
   * `label` names the command in errors, so a LOGIN failure never echoes the password.
   */
  const run = async (command: string, label = command.split(" ")[0] ?? "command"): Promise<Untagged[]> => {
    const tag = `e${++tagCount}`;
    await writer.write(encoder.encode(`${tag} ${command}\r\n`));
    const untagged: Untagged[] = [];
    for (;;) {
      const reply = await response();
      if (!reply.text.startsWith(`${tag} `)) {
        untagged.push(reply);
        continue;
      }
      const status = reply.text.slice(tag.length + 1);
      if (!status.startsWith("OK")) throw new Error(`IMAP ${label} failed: ${status}`);
      return untagged;
    }
  };

  const close = async () => {
    try {
      await run("LOGOUT");
    } finally {
      await socket.close();
    }
  };

  return { greeting, run, close };
};

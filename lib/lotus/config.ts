import { usesMemoryStore } from "@/lib/leads/store";

export type LotusConfig = { url: string; secret: string };

/**
 * Why leads are, or are not, forwarded to lotus.
 * - `unconfigured`: one of the two variables is missing. Nothing is sent.
 * - `invalid`: the URL cannot be used (not a URL, or plain HTTP to a remote host).
 * - `blocked`: leads are kept in memory and the URL is not a local one (see below).
 */
export type LotusState =
  { status: "active"; config: LotusConfig } | { status: "unconfigured" | "invalid" | "blocked" };

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

/**
 * Reads `LOTUS_WEBHOOK_URL` and `LOTUS_WEBHOOK_SECRET`. Forwarding is off unless both are
 * set and usable.
 *
 * With leads kept in memory, ids restart at 1 with the server: `site-1` sent to the real
 * lotus would collide with a real lead and be taken for a duplicate. Such a build may only
 * talk to a lotus running on the same machine.
 */
export const getLotusState = (): LotusState => {
  const url = process.env.LOTUS_WEBHOOK_URL;
  const secret = process.env.LOTUS_WEBHOOK_SECRET;

  if (!url || !secret) {
    return { status: "unconfigured" };
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return { status: "invalid" };
  }

  const isLocal = LOCAL_HOSTS.includes(parsed.hostname);

  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLocal)) {
    return { status: "invalid" };
  }

  if (usesMemoryStore() && !isLocal) {
    return { status: "blocked" };
  }

  return { status: "active", config: { url, secret } };
};

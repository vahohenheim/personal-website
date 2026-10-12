import { vi } from "vitest";

export const LOTUS_URL = "http://localhost:3999/api/webhooks/leads";
export const LOTUS_SECRET = "test-secret";

/** Turns forwarding on, towards a lotus that only exists as a mocked `fetch`. */
export const enableLotus = (url = LOTUS_URL) => {
  vi.stubEnv("LOTUS_WEBHOOK_URL", url);
  vi.stubEnv("LOTUS_WEBHOOK_SECRET", LOTUS_SECRET);
};

type Call = { url: string; headers: Record<string, string>; body: string };

/**
 * Replaces `fetch` by a lotus that answers what `answer` returns for each call, and
 * keeps what it received.
 */
export const mockLotus = (answer: (call: Call, index: number) => Response | Promise<Response>) => {
  const calls: Call[] = [];

  vi.stubGlobal(
    "fetch",
    vi.fn((url: string | URL, init?: RequestInit) => {
      const call = {
        url: String(url),
        headers: Object.fromEntries(new Headers(init?.headers).entries()),
        body: typeof init?.body === "string" ? init.body : "",
      };
      calls.push(call);

      return Promise.resolve(answer(call, calls.length - 1));
    }),
  );

  return calls;
};

export const created = (id: string | number = "lotus-1") => Response.json({ id }, { status: 201 });
export const duplicate = (id: string | number = "lotus-1") =>
  Response.json({ id, duplicate: true }, { status: 200 });
export const status = (code: number) => new Response(null, { status: code });

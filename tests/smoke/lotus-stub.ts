import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer, type Server } from "node:http";

// A stand-in for lotus, for the smoke tests. It applies the rules of the contract
// (../lotus/docs/integration-site.md): signature of `<timestamp>.<body>`, timestamp within
// five minutes, required fields, and one lead per `externalId`.

type Mode = "up" | "down" | "lost-answer";

const TOLERANCE_SECONDS = 5 * 60;

const read = (request: NodeJS.ReadableStream) =>
  new Promise<string>((resolve) => {
    let body = "";
    request.on("data", (chunk: Buffer) => (body += chunk.toString("utf8")));
    request.on("end", () => {
      resolve(body);
    });
  });

export const startLotusStub = (port: number, secret: string) =>
  new Promise<Server>((resolve) => {
    /** `externalId` to the id lotus gave. */
    const leads = new Map<string, string>();
    const received: unknown[] = [];
    let mode: Mode = "up";

    const server = createServer((request, response) => {
      const answer = (status: number, body: unknown) => {
        response.writeHead(status, { "content-type": "application/json" });
        response.end(JSON.stringify(body));
      };

      void read(request).then((rawBody) => {
        // Controls used by the tests, not part of lotus.
        if (request.url === "/__mode") {
          mode = (JSON.parse(rawBody) as { mode: Mode }).mode;
          answer(200, { mode });

          return;
        }

        if (request.url === "/__received") {
          answer(200, received);

          return;
        }

        if (request.url !== "/api/webhooks/leads" || request.method !== "POST") {
          answer(404, { error: "NOT_FOUND" });

          return;
        }

        if (mode === "down") {
          answer(503, { error: "WEBHOOK_DISABLED" });

          return;
        }

        const timestamp = String(request.headers["x-lotus-timestamp"] ?? "");
        const signature = Buffer.from(String(request.headers["x-lotus-signature"] ?? ""));
        const expected = Buffer.from(
          `sha256=${createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")}`,
        );
        const isFresh =
          /^\d{9,12}$/.test(timestamp) &&
          Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) <= TOLERANCE_SECONDS;

        if (
          !isFresh ||
          signature.length !== expected.length ||
          !timingSafeEqual(signature, expected)
        ) {
          answer(401, { error: "UNAUTHORIZED" });

          return;
        }

        const payload = JSON.parse(rawBody) as Record<string, unknown>;
        const externalId = typeof payload.externalId === "string" ? payload.externalId : "";

        if (!payload.name || !payload.email || !payload.need || !externalId) {
          answer(400, { error: "VALIDATION" });

          return;
        }

        const known = leads.get(externalId);

        if (known) {
          answer(200, { id: known, duplicate: true });

          return;
        }

        const id = `lotus-${leads.size + 1}`;
        leads.set(externalId, id);
        received.push(payload);

        // The lead is created, but the site never hears about it.
        if (mode === "lost-answer") {
          answer(500, { error: "INTERNAL" });

          return;
        }

        answer(201, { id });
      });
    });

    server.listen(port, () => {
      resolve(server);
    });
  });

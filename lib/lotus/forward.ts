import { createHmac } from "node:crypto";
import { type Lead, type SyncOutcome } from "@/lib/models/lead";
import fr from "@/locales/fr";
import { type LotusConfig } from "./config";

// The contract with lotus: ../lotus/docs/integration-site.md, summarised in
// docs/features/lotus-sync.md. Everything here is pure, except `forwardLead`.

const TIMEOUT_MS = 5000;

/** Body of the webhook. Optional fields are left out when the lead does not have them. */
export type LotusPayload = {
  externalId: string;
  name: string;
  email: string;
  message: string;
  company?: string;
  need: string;
  timeline?: string;
  locale: string;
  referrer?: string;
  submittedAt: string;
};

/** Identifier of a lead on the lotus side. It makes sending a lead twice harmless. */
export const getExternalId = (id: number) => `site-${id}`;

/**
 * What lotus receives for a lead. `need` and `timeline` are the French labels, whatever
 * the language of the visitor: lotus is a French interface and does not know the codes.
 * Nothing about the follow-up (status, notes, amount) leaves the site.
 */
export const buildLotusPayload = (lead: Lead): LotusPayload => ({
  externalId: getExternalId(lead.id),
  name: lead.name,
  email: lead.email,
  message: lead.message,
  ...(lead.company && { company: lead.company }),
  need: fr.contact.need.options[lead.need],
  ...(lead.timeline && { timeline: fr.contact.details.timelines[lead.timeline] }),
  locale: lead.locale,
  ...(lead.source && { referrer: lead.source }),
  submittedAt: lead.createdAt,
});

/**
 * Signature of a request: `sha256=` and the hex HMAC SHA-256 of `<timestamp>.<body>`.
 * `body` must be the exact string that is sent.
 */
export const signLotusBody = (secret: string, timestamp: string, body: string) =>
  `sha256=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;

/** Reads the answer of lotus. See the table of answers in the contract. */
const readResponse = async (response: Response): Promise<SyncOutcome> => {
  if (response.status === 200 || response.status === 201) {
    const answer = (await response.json().catch(() => null)) as {
      id?: unknown;
      duplicate?: unknown;
    } | null;
    const id = answer?.id;

    return {
      status: "synced",
      lotusLeadId: typeof id === "string" || typeof id === "number" ? String(id) : null,
      duplicate: answer?.duplicate === true,
    };
  }

  const code = `http_${response.status}`;

  // The body was refused: a defect of the contract, which sending again would not fix.
  if (response.status === 400 || response.status === 413) {
    return { status: "rejected", code };
  }

  // 401 (secret being rotated), 503 (webhook off), 5xx, and anything unexpected.
  return { status: "pending", code };
};

/**
 * Sends one lead to lotus and says what came out of it. Never throws: a timeout or a
 * network error leaves the lead pending. The timestamp is the time of sending, so it is
 * computed again at each attempt.
 */
export const forwardLead = async (
  lead: Lead,
  config: LotusConfig,
  now: () => number = Date.now,
): Promise<SyncOutcome> => {
  // Serialised once: the string that is signed is the string that is sent.
  const body = JSON.stringify(buildLotusPayload(lead));
  const timestamp = String(Math.floor(now() / 1000));

  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-lotus-timestamp": timestamp,
        "x-lotus-signature": signLotusBody(config.secret, timestamp, body),
      },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    return await readResponse(response);
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";

    return { status: "pending", code: isTimeout ? "timeout" : "network" };
  }
};

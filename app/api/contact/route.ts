import { checkBotId } from "botid/server";
import { after } from "next/server";
import { MissingDatabaseUrlError } from "@/lib/db/client";
import { getLeadStore } from "@/lib/leads/store";
import { isLikelyBot, parseLead } from "@/lib/leads/validation";
import { syncLead } from "@/lib/lotus/sync";
import { type ContactErrorCode, type Lead } from "@/lib/models/lead";

const fail = (error: ContactErrorCode, status: number) => Response.json({ error }, { status });

/** Receives a lead from the contact dialog. See docs/features/contact-form.md. */
export async function POST(request: Request) {
  // BotID needs the Vercel platform (it reads a token set by Vercel). Elsewhere, the
  // honeypot and the time trap below are the only filters.
  const isBot = process.env.VERCEL ? (await checkBotId()).isBot : false;

  if (isBot) {
    return fail("forbidden", 403);
  }

  let body: Record<string, unknown>;

  try {
    const parsed: unknown = await request.json();

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return fail("invalid_body", 400);
    }

    body = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid_body", 400);
  }

  // A bot gets the same answer as a person, so that it learns nothing.
  if (isLikelyBot({ website: body.website, startedAt: body.startedAt, now: Date.now() })) {
    return Response.json({ ok: true });
  }

  const result = parseLead(body);

  if (!result.ok) {
    return fail(result.error, 400);
  }

  let lead: Lead;

  try {
    lead = await getLeadStore().insert(result.value);
  } catch (error) {
    if (error instanceof MissingDatabaseUrlError) {
      console.error("[contact] DATABASE_URL is missing: the lead was not stored.");

      return fail("unavailable", 503);
    }

    // Never the message nor the contact details in the logs.
    console.error("[contact] could not store the lead", {
      name: error instanceof Error ? error.name : "unknown",
    });

    return fail("server_error", 500);
  }

  // The lead is stored: the visitor gets the answer now. Forwarding it to lotus happens
  // once the response is sent and can never change it (docs/features/lotus-sync.md).
  after(() => syncLead(lead));

  return Response.json({ ok: true });
}

import { checkBotId } from "botid/server";
import { getFunnelStore } from "@/lib/funnel/store";
import { isFunnelEvent } from "@/lib/models/funnel";

const DONE = new Response(null, { status: 204 });

/**
 * Counts one step of the contact form. Only a counter moves: nothing about the visitor is
 * read or stored. The answer is always empty, whatever happened, so that the form never
 * depends on it. See docs/features/conversion.md.
 */
export async function POST(request: Request) {
  try {
    // BotID needs the Vercel platform; elsewhere every request is counted.
    if (process.env.VERCEL && (await checkBotId()).isBot) {
      return DONE;
    }

    const body: unknown = await request.json();
    const event =
      typeof body === "object" && body !== null ? (body as { event?: unknown }).event : null;

    if (isFunnelEvent(event)) {
      await getFunnelStore().increment(event, new Date().toISOString().slice(0, 10));
    }
  } catch (error) {
    console.error("[events] could not count the event", {
      name: error instanceof Error ? error.name : "unknown",
    });
  }

  return DONE;
}

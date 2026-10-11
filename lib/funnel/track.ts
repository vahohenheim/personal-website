import { type FunnelEvent } from "@/lib/models/funnel";

/**
 * Counts one step of the contact form. Sent with `fetch` (BotID needs it), kept alive if
 * the page is left, and never awaited: measuring must not slow the form down or break it.
 */
export const trackFunnel = (event: FunnelEvent) => {
  void fetch("/api/events/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
    keepalive: true,
  }).catch(() => undefined);
};

/** Noted once per page load. `null` until `rememberSource` has run. */
let source: string | null = null;

/**
 * Notes where the visitor came from: a `utm_source` if the link carried one, else the host
 * of the referring site, else nothing (a direct visit). Kept in memory only: nothing is
 * written to the browser, so it lasts until the page is reloaded.
 */
export const rememberSource = () => {
  if (source !== null) {
    return;
  }

  try {
    const campaign = new URLSearchParams(window.location.search).get("utm_source");
    const referrer = document.referrer ? new URL(document.referrer).hostname : "";
    const external = referrer !== "" && referrer !== window.location.hostname ? referrer : "";

    source = campaign ?? external;
  } catch {
    // A referrer that is not a URL: the lead is simply stored without a source.
    source = "";
  }
};

export const readSource = () => source ?? "";

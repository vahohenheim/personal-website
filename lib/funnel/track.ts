import { type FunnelEvent } from "@/lib/models/funnel";

const SOURCE_KEY = "lead-source";

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

/**
 * Remembers, for the time of the visit, where the visitor came from: a `utm_source` if the
 * link carried one, else the host of the referring site. Nothing for a direct visit.
 */
export const rememberSource = () => {
  try {
    if (window.sessionStorage.getItem(SOURCE_KEY) !== null) {
      return;
    }

    const campaign = new URLSearchParams(window.location.search).get("utm_source");
    const referrer = document.referrer ? new URL(document.referrer).hostname : "";
    const external = referrer !== "" && referrer !== window.location.hostname ? referrer : "";

    window.sessionStorage.setItem(SOURCE_KEY, campaign ?? external);
  } catch {
    // Storage can be blocked: the lead is then simply stored without a source.
  }
};

export const readSource = () => {
  try {
    return window.sessionStorage.getItem(SOURCE_KEY) ?? "";
  } catch {
    return "";
  }
};

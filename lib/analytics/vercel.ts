// Audience figures, read from the Web Analytics API of Vercel: the same aggregated numbers
// as the Vercel dashboard (visitors and page views, no cookie, no personal data).
// Server only: the token never leaves this module, and nothing read from the environment
// is logged. See docs/features/analytics.md.

const DEFAULT_API_URL = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
const TIMEOUT_MS = 8000;

/** What a breakdown can be split by, and the name of each one in the Vercel API. */
export const ANALYTICS_DIMENSIONS = {
  page: "requestPath",
  referrer: "referrerHostname",
  country: "country",
  device: "deviceType",
} as const;

export type AnalyticsDimension = keyof typeof ANALYTICS_DIMENSIONS;

export type TrafficRow = { visitors: number; pageviews: number };
export type DailyTrafficRow = TrafficRow & { day: string };
export type BreakdownRow = TrafficRow & { label: string };

type ApiRow = Record<string, unknown>;

type Config = { token: string; projectId: string; teamId?: string; apiUrl: string };

export class AnalyticsApiError extends Error {
  constructor(readonly httpStatus: number) {
    super("Web Analytics API");
    this.name = "AnalyticsApiError";
  }
}

/** Null when the token or the project id is missing: the feature is then simply off. */
export const getAnalyticsConfig = (): Config | null => {
  const token = process.env.WEB_ANALYTICS_TOKEN;
  // On Vercel, the platform provides the project id.
  const projectId = process.env.WEB_ANALYTICS_PROJECT_ID ?? process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return null;
  }

  return {
    token,
    projectId,
    teamId: process.env.WEB_ANALYTICS_TEAM_ID ?? undefined,
    // Overridable so that the pipeline can be tested against a local stand-in.
    apiUrl: process.env.WEB_ANALYTICS_API_URL ?? DEFAULT_API_URL,
  };
};

const toCount = (value: unknown) => {
  const count = Number(value ?? 0);

  return Number.isFinite(count) && count > 0 ? Math.round(count) : 0;
};

const aggregate = async (
  config: Config,
  range: { since: string; until: string },
  by: string,
  limit?: number,
): Promise<ApiRow[]> => {
  const params = new URLSearchParams({ projectId: config.projectId, by, ...range });

  if (config.teamId) {
    params.set("teamId", config.teamId);
  }

  if (limit) {
    params.set("limit", String(limit));
  }

  const response = await fetch(`${config.apiUrl}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new AnalyticsApiError(response.status);
  }

  const body = (await response.json()) as { data?: unknown };

  return Array.isArray(body.data) ? (body.data as ApiRow[]) : [];
};

/** Visitors and page views of each day of the range. Days without a visit are absent. */
export const fetchDailyTraffic = async (
  config: Config,
  range: { since: string; until: string },
): Promise<DailyTrafficRow[]> => {
  const rows = await aggregate(config, range, "day");

  return rows.flatMap((row) =>
    typeof row.timestamp === "string"
      ? [
          {
            day: row.timestamp.slice(0, 10),
            visitors: toCount(row.visitors),
            pageviews: toCount(row.pageviews),
          },
        ]
      : [],
  );
};

/** Ways of asking the API for a single day. Which one it honours is not documented. */
export const DAY_RANGES = {
  /** `since` and `until` set to the same date. */
  sameDate: (day: string) => ({ since: day, until: day }),
  /** Full timestamps, from the first to the last millisecond of the day. */
  timestamps: (day: string) => ({ since: `${day}T00:00:00.000Z`, until: `${day}T23:59:59.999Z` }),
  /** `until` set to the next date, for an API that excludes it. */
  nextDate: (day: string) => {
    const next = new Date(`${day}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);

    return { since: day, until: next.toISOString().slice(0, 10) };
  },
} as const;

export type DayRangeMode = keyof typeof DAY_RANGES;

/** Visitors and page views of one day, split by a dimension. The value is kept raw. */
export const fetchBreakdown = async (
  config: Config,
  day: string,
  dimension: AnalyticsDimension,
  limit: number,
  mode: DayRangeMode,
): Promise<BreakdownRow[]> => {
  const key = ANALYTICS_DIMENSIONS[dimension];
  const rows = await aggregate(config, DAY_RANGES[mode](day), key, limit);

  return rows
    .map((row) => ({
      label: typeof row[key] === "string" ? row[key].trim() : "",
      visitors: toCount(row.visitors),
      pageviews: toCount(row.pageviews),
    }))
    .filter((row) => row.visitors > 0 || row.pageviews > 0);
};

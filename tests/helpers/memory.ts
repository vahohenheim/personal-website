/** Empties the in-memory stores, which live on `globalThis` (see lib/leads/store.ts). */
export const resetMemoryStores = () => {
  const holder = globalThis as Record<string, unknown>;

  delete holder.__devLeads;
  delete holder.__devFunnel;
  delete holder.__devAnalytics;
};

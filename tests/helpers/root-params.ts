// Stands in for `next/root-params`, which only exists inside a Next.js build: the
// tests run as if every request were for the French pages.
export const locale = () => Promise.resolve("fr");

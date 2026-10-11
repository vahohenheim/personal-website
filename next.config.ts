import createMDX from "@next/mdx";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

// React needs eval for its debugging tools in development only.
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: {
    // A stray lockfile higher up the tree would otherwise be picked as the root.
    root: __dirname,
  },
  redirects() {
    return Promise.resolve([
      // The resume used to be a single file; it now exists in each language.
      { source: "/cv.pdf", destination: "/cv-fr.pdf", permanent: true },
    ]);
  },
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]);
  },
};

// Lets the posts in content/posts/ be imported as components. They are not routes.
const withMDX = createMDX();

// withBotId adds the rewrites of the BotID proxy.
export default withBotId(withMDX(nextConfig));

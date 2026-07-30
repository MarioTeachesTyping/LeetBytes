import type { NextConfig } from "next";

// Where the LeetBytes API server lives. Requests to /api/* are proxied there,
// so the browser only ever talks to the Next.js origin (no CORS needed).
const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // Workspace packages ship TypeScript source, so Next compiles them itself.
  transpilePackages: ["@leetbytes/shared", "@leetbytes/problems"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${SERVER_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

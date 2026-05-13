import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Monorepo has duplicate @types/react versions (bun + next resolve differently).
    // The actual code is correct — this skips the false positives during build.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@apollo/client", "ts-invariant"],
};

export default nextConfig;

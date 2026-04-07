import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isGithubActions && repositoryName ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_YOUTUBE_API_KEY:
      process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? process.env.YOUTUBE_API_KEY ?? "",
    NEXT_PUBLIC_TIKTOK_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_TIKTOK_ACCESS_TOKEN ??
      process.env.TIKTOK_ACCESS_TOKEN ??
      "",
    NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN ??
      process.env.INSTAGRAM_ACCESS_TOKEN ??
      "",
    NEXT_PUBLIC_INSTAGRAM_USER_ID:
      process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID ?? process.env.INSTAGRAM_USER_ID ?? "",
  },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;

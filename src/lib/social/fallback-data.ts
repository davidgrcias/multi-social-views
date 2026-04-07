import type { PlatformName, SocialPlatformData } from "./types";

const now = () => new Date().toISOString();

const profile = (seed: string) =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}`;

const fallbackMap: Record<PlatformName, SocialPlatformData> = {
  youtube: {
    platform: "youtube",
    accountInput: "youtube.com/davidgtech",
    accountName: "davidgtech",
    profileImageUrl: profile("youtube-davidgtech"),
    totalViews: 129_430,
    source: "fallback",
    fetchedAt: now(),
    note: "Mode demo aktif. Isi YouTube API key untuk data official terbaru.",
    contents: [
      {
        id: "yt-1",
        title: "Build API With Next.js App Router",
        views: 31_240,
        url: "https://youtube.com/davidgtech",
      },
      {
        id: "yt-2",
        title: "TypeScript Tips for Clean Code",
        views: 26_830,
        url: "https://youtube.com/davidgtech",
      },
      {
        id: "yt-3",
        title: "Deploy to GitHub Pages from CI",
        views: 23_150,
        url: "https://youtube.com/davidgtech",
      },
      {
        id: "yt-4",
        title: "State Management Without Overkill",
        views: 18_740,
        url: "https://youtube.com/davidgtech",
      },
      {
        id: "yt-5",
        title: "Testing UI Flows With Playwright",
        views: 15_100,
        url: "https://youtube.com/davidgtech",
      },
    ],
  },
  tiktok: {
    platform: "tiktok",
    accountInput: "tiktok.com/@davidgtech",
    accountName: "@davidgtech",
    profileImageUrl: profile("tiktok-davidgtech"),
    totalViews: 88_910,
    source: "fallback",
    fetchedAt: now(),
    note: "Mode demo aktif. Isi TikTok access token (scope user.info.basic + video.list) untuk data official.",
    contents: [
      {
        id: "tt-1",
        title: "Debugging Next.js in 60 Seconds",
        views: 28_201,
        url: "https://tiktok.com/@davidgtech",
      },
      {
        id: "tt-2",
        title: "How to Make Build Time Faster",
        views: 18_040,
        url: "https://tiktok.com/@davidgtech",
      },
      {
        id: "tt-3",
        title: "Simple API Design Rule",
        views: 14_842,
        url: "https://tiktok.com/@davidgtech",
      },
      {
        id: "tt-4",
        title: "Refactor Legacy Component",
        views: 13_100,
        url: "https://tiktok.com/@davidgtech",
      },
      {
        id: "tt-5",
        title: "Testing Checklist Before Release",
        views: 8_220,
        url: "https://tiktok.com/@davidgtech",
      },
    ],
  },
  instagram: {
    platform: "instagram",
    accountInput: "instagram.com/davidgtech",
    accountName: "davidgtech",
    profileImageUrl: profile("instagram-davidgtech"),
    totalViews: 53_040,
    source: "fallback",
    fetchedAt: now(),
    note: "Mode demo aktif. Isi Instagram token + IG User ID (business/creator) untuk data official insights.",
    contents: [
      {
        id: "ig-1",
        title: "Carousel: Architecture Notes",
        views: 14_330,
        url: "https://instagram.com/davidgtech",
      },
      {
        id: "ig-2",
        title: "Reel: API Error Handling",
        views: 12_740,
        url: "https://instagram.com/davidgtech",
      },
      {
        id: "ig-3",
        title: "Reel: Component Boundaries",
        views: 10_520,
        url: "https://instagram.com/davidgtech",
      },
      {
        id: "ig-4",
        title: "Static Export Checklist",
        views: 8_610,
        url: "https://instagram.com/davidgtech",
      },
      {
        id: "ig-5",
        title: "Playwright Test Patterns",
        views: 6_840,
        url: "https://instagram.com/davidgtech",
      },
    ],
  },
};

export function getFallbackData(
  platform: PlatformName,
  accountInput: string,
): SocialPlatformData {
  const base = fallbackMap[platform];
  const copy = JSON.parse(JSON.stringify(base)) as SocialPlatformData;
  copy.accountInput = accountInput;
  copy.fetchedAt = now();
  return copy;
}

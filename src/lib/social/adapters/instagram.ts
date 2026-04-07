import type { SocialPlatformData } from "../types";

const GRAPH_API_BASE = "https://graph.facebook.com/v24.0";

type InstagramProfileResponse = {
  name?: string;
  username?: string;
  profile_picture_url?: string;
};

type InstagramMediaResponse = {
  data?: Array<{
    id: string;
    caption?: string;
    media_type?: string;
    permalink?: string;
    timestamp?: string;
    media_url?: string;
    thumbnail_url?: string;
  }>;
};

type InstagramInsightsResponse = {
  data?: Array<{
    name?: string;
    values?: Array<{
      value?: number;
    }>;
  }>;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchInstagramData(
  usernameInput: string,
  accessToken: string,
  instagramUserId: string,
): Promise<SocialPlatformData> {
  if (!accessToken.trim() || !instagramUserId.trim()) {
    throw new Error("Instagram token dan Instagram User ID wajib diisi.");
  }

  const profileUrl =
    `${GRAPH_API_BASE}/${instagramUserId}` +
    `?fields=name,username,profile_picture_url&access_token=${encodeURIComponent(accessToken)}`;

  const mediaUrl =
    `${GRAPH_API_BASE}/${instagramUserId}/media` +
    `?fields=id,caption,media_type,permalink,timestamp,media_url,thumbnail_url&limit=5` +
    `&access_token=${encodeURIComponent(accessToken)}`;

  const [profile, media] = await Promise.all([
    fetchJson<InstagramProfileResponse>(profileUrl),
    fetchJson<InstagramMediaResponse>(mediaUrl),
  ]);

  const mediaItems = media.data ?? [];
  const contents = await Promise.all(
    mediaItems.slice(0, 5).map(async (item, index) => {
      let views: number | null = null;

      try {
        const insightsUrl =
          `${GRAPH_API_BASE}/${item.id}/insights` +
          `?metric=views&access_token=${encodeURIComponent(accessToken)}`;
        const insights = await fetchJson<InstagramInsightsResponse>(insightsUrl);
        views = insights.data?.[0]?.values?.[0]?.value ?? null;
      } catch {
        views = null;
      }

      return {
        id: item.id,
        title: item.caption?.split("\n")[0] || `Post ${index + 1}`,
        views,
        url: item.permalink ?? `https://instagram.com/${usernameInput}`,
        publishedAt: item.timestamp,
        thumbnailUrl: item.thumbnail_url ?? item.media_url,
      };
    }),
  );

  const knownViews = contents
    .map((item) => item.views)
    .filter((value): value is number => typeof value === "number");

  return {
    platform: "instagram",
    accountInput: usernameInput,
    accountName: profile.name ?? profile.username ?? usernameInput,
    profileImageUrl: profile.profile_picture_url ?? "",
    totalViews:
      knownViews.length > 0
        ? knownViews.reduce((sum, value) => sum + value, 0)
        : null,
    contents,
    source: "official-api",
    fetchedAt: new Date().toISOString(),
    note: "Sumber: Instagram Graph API (business/creator).",
  };
}

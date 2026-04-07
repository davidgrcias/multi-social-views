import type { SocialPlatformData } from "../types";

const TIKTOK_API_BASE = "https://open.tiktokapis.com/v2";

type TiktokUserInfoResponse = {
  data?: {
    user?: {
      display_name?: string;
      avatar_url?: string;
      profile_deep_link?: string;
    };
  };
};

type TiktokVideoListResponse = {
  data?: {
    videos?: Array<{
      id?: string;
      title?: string;
      video_description?: string;
      view_count?: number;
      embed_link?: string;
      share_url?: string;
      create_time?: string;
      cover_image_url?: string;
    }>;
  };
};

async function postJson<T>(
  url: string,
  token: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`TikTok API error: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchTiktokData(
  usernameInput: string,
  accessToken: string,
): Promise<SocialPlatformData> {
  if (!accessToken.trim()) {
    throw new Error("TikTok access token belum diisi.");
  }

  const userInfoUrl = `${TIKTOK_API_BASE}/user/info/?fields=open_id,avatar_url,display_name,profile_deep_link`;
  const videoListUrl = `${TIKTOK_API_BASE}/video/list/?fields=id,title,video_description,cover_image_url,embed_link,share_url,view_count,create_time`;

  const [userInfo, videoList] = await Promise.all([
    postJson<TiktokUserInfoResponse>(userInfoUrl, accessToken, {}),
    postJson<TiktokVideoListResponse>(videoListUrl, accessToken, {
      max_count: 5,
    }),
  ]);

  const videos = videoList.data?.videos ?? [];
  const totalViews = videos.reduce((sum, item) => sum + (item.view_count ?? 0), 0);

  return {
    platform: "tiktok",
    accountInput: usernameInput,
    accountName: userInfo.data?.user?.display_name ?? usernameInput,
    profileImageUrl: userInfo.data?.user?.avatar_url ?? "",
    totalViews,
    contents: videos.slice(0, 5).map((item, index) => ({
      id: item.id ?? `tt-${index}`,
      title: item.title ?? item.video_description ?? `Video ${index + 1}`,
      views: item.view_count ?? null,
      url: item.embed_link ?? item.share_url ?? `https://www.tiktok.com/${usernameInput}`,
      publishedAt: item.create_time,
      thumbnailUrl: item.cover_image_url,
    })),
    source: "official-api",
    fetchedAt: new Date().toISOString(),
    note: "Sumber: TikTok Display API (/v2/user/info dan /v2/video/list).",
  };
}

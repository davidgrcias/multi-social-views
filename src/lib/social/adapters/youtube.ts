import type { SocialPlatformData } from "../types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

type YoutubeChannelResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      customUrl?: string;
      thumbnails?: {
        default?: { url?: string };
        high?: { url?: string };
      };
    };
    statistics?: {
      viewCount?: string;
    };
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
};

type YoutubePlaylistItemResponse = {
  items?: Array<{
    contentDetails?: {
      videoId?: string;
      videoPublishedAt?: string;
    };
    snippet?: {
      title?: string;
      resourceId?: { videoId?: string };
      publishedAt?: string;
    };
  }>;
};

type YoutubeVideosResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: {
        medium?: { url?: string };
        high?: { url?: string };
      };
    };
    statistics?: {
      viewCount?: string;
    };
  }>;
};

type YoutubeVideoItem = NonNullable<YoutubeVideosResponse["items"]>[number];

function cleanYoutubeInput(input: string): string {
  return input.trim().replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}

function resolveChannelRef(input: string): { forHandle?: string; id?: string } {
  const cleaned = cleanYoutubeInput(input);

  if (cleaned.startsWith("youtube.com/")) {
    const path = cleaned.replace(/^youtube\.com\//i, "");
    if (path.startsWith("@")) {
      return { forHandle: path.split("/")[0] };
    }
    if (path.startsWith("channel/")) {
      const channelId = path.split("/")[1] || "";
      return channelId ? { id: channelId } : {};
    }
  }

  if (cleaned.startsWith("@")) {
    return { forHandle: cleaned };
  }

  if (cleaned.startsWith("UC")) {
    return { id: cleaned };
  }

  return { forHandle: cleaned.startsWith("@") ? cleaned : `@${cleaned}` };
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchYoutubeData(
  channelInput: string,
  apiKey: string,
): Promise<SocialPlatformData> {
  if (!apiKey.trim()) {
    throw new Error("YouTube API key belum diisi.");
  }

  const ref = resolveChannelRef(channelInput);

  const channelUrl = new URL(`${YOUTUBE_API_BASE}/channels`);
  channelUrl.searchParams.set("part", "snippet,statistics,contentDetails");
  channelUrl.searchParams.set("maxResults", "1");
  channelUrl.searchParams.set("key", apiKey);
  if (ref.id) {
    channelUrl.searchParams.set("id", ref.id);
  } else if (ref.forHandle) {
    channelUrl.searchParams.set("forHandle", ref.forHandle);
  }

  const channelData = await fetchJson<YoutubeChannelResponse>(channelUrl);
  const channel = channelData.items?.[0];
  if (!channel) {
    throw new Error("Channel YouTube tidak ditemukan.");
  }

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error("Uploads playlist YouTube tidak tersedia.");
  }

  const playlistUrl = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
  playlistUrl.searchParams.set("part", "snippet,contentDetails");
  playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
  playlistUrl.searchParams.set("maxResults", "5");
  playlistUrl.searchParams.set("key", apiKey);

  const playlistData = await fetchJson<YoutubePlaylistItemResponse>(playlistUrl);
  const videoIds = (playlistData.items ?? [])
    .map(
      (item) =>
        item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId ?? "",
    )
    .filter(Boolean);

  let videoStatsById = new Map<string, YoutubeVideoItem>();
  if (videoIds.length > 0) {
    const videosUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
    videosUrl.searchParams.set("part", "snippet,statistics");
    videosUrl.searchParams.set("id", videoIds.join(","));
    videosUrl.searchParams.set("key", apiKey);

    const videosData = await fetchJson<YoutubeVideosResponse>(videosUrl);
    videoStatsById = new Map((videosData.items ?? []).map((v) => [v.id, v]));
  }

  const contents = (playlistData.items ?? []).map((item, index) => {
    const id =
      item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId ?? `yt-${index}`;
    const video = videoStatsById.get(id);
    const viewsRaw = video?.statistics?.viewCount;

    return {
      id,
      title: video?.snippet?.title ?? item.snippet?.title ?? `Video ${index + 1}`,
      views: viewsRaw ? Number(viewsRaw) : null,
      url: `https://www.youtube.com/watch?v=${id}`,
      publishedAt:
        video?.snippet?.publishedAt ??
        item.contentDetails?.videoPublishedAt ??
        item.snippet?.publishedAt,
      thumbnailUrl:
        video?.snippet?.thumbnails?.high?.url ??
        video?.snippet?.thumbnails?.medium?.url,
    };
  });

  return {
    platform: "youtube",
    accountInput: channelInput,
    accountName: channel.snippet?.title ?? channel.snippet?.customUrl ?? channelInput,
    profileImageUrl:
      channel.snippet?.thumbnails?.high?.url ??
      channel.snippet?.thumbnails?.default?.url ??
      "",
    totalViews: channel.statistics?.viewCount
      ? Number(channel.statistics.viewCount)
      : null,
    contents,
    source: "official-api",
    fetchedAt: new Date().toISOString(),
    note: "Sumber: YouTube Data API v3 (channels.list, playlistItems.list, videos.list).",
  };
}

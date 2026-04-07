export type PlatformName = "youtube" | "tiktok" | "instagram";

export interface SocialContentItem {
  id: string;
  title: string;
  views: number | null;
  url: string;
  publishedAt?: string;
  thumbnailUrl?: string;
}

export interface SocialPlatformData {
  platform: PlatformName;
  accountInput: string;
  accountName: string;
  profileImageUrl: string;
  totalViews: number | null;
  contents: SocialContentItem[];
  source: "official-api" | "fallback";
  fetchedAt: string;
  note?: string;
}

export interface DashboardInputs {
  youtube: string;
  tiktok: string;
  instagram: string;
}

export interface DashboardCredentials {
  youtubeApiKey: string;
  tiktokAccessToken: string;
  instagramAccessToken: string;
  instagramUserId: string;
}

export interface DashboardLoadResult {
  platforms: SocialPlatformData[];
  fetchedAt: string;
}

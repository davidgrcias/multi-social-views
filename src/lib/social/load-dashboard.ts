import { fetchInstagramData } from "./adapters/instagram";
import { fetchTiktokData } from "./adapters/tiktok";
import { fetchYoutubeData } from "./adapters/youtube";
import { getFallbackData } from "./fallback-data";
import type {
  DashboardCredentials,
  DashboardInputs,
  DashboardLoadResult,
  PlatformName,
  SocialPlatformData,
} from "./types";

function withFallbackNote(data: SocialPlatformData, reason: string): SocialPlatformData {
  return {
    ...data,
    fetchedAt: new Date().toISOString(),
    note: `${data.note ?? "Mode fallback"} Alasan: ${reason}`,
  };
}

async function safeLoad(
  platform: PlatformName,
  input: string,
  loader: () => Promise<SocialPlatformData>,
): Promise<SocialPlatformData> {
  try {
    return await loader();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return withFallbackNote(getFallbackData(platform, input), message);
  }
}

export async function loadDashboardData(
  inputs: DashboardInputs,
  credentials: DashboardCredentials,
): Promise<DashboardLoadResult> {
  const [youtube, tiktok, instagram] = await Promise.all([
    safeLoad("youtube", inputs.youtube, () =>
      fetchYoutubeData(inputs.youtube, credentials.youtubeApiKey),
    ),
    safeLoad("tiktok", inputs.tiktok, () =>
      fetchTiktokData(inputs.tiktok, credentials.tiktokAccessToken),
    ),
    safeLoad("instagram", inputs.instagram, () =>
      fetchInstagramData(
        inputs.instagram,
        credentials.instagramAccessToken,
        credentials.instagramUserId,
      ),
    ),
  ]);

  return {
    platforms: [youtube, tiktok, instagram],
    fetchedAt: new Date().toISOString(),
  };
}

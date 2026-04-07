import { fetchInstagramData } from "./adapters/instagram";
import { fetchTiktokData } from "./adapters/tiktok";
import { fetchYoutubeData } from "./adapters/youtube";
import { getUnavailableData } from "./fallback-data";
import type {
  DashboardCredentials,
  DashboardInputs,
  DashboardLoadResult,
  PlatformName,
  SocialPlatformData,
} from "./types";

async function safeLoad(
  platform: PlatformName,
  input: string,
  loader: () => Promise<SocialPlatformData>,
): Promise<SocialPlatformData> {
  try {
    return await loader();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return getUnavailableData(platform, input, message);
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

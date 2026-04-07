import type { PlatformName, SocialPlatformData } from "./types";

const now = () => new Date().toISOString();

function normalizeAccountName(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .at(-1) || input;
}

export function getUnavailableData(
  platform: PlatformName,
  accountInput: string,
  reason: string,
): SocialPlatformData {
  const accountName = normalizeAccountName(accountInput);

  return {
    platform,
    accountInput,
    accountName,
    profileImageUrl: "",
    totalViews: null,
    contents: [],
    source: "unavailable",
    fetchedAt: now(),
    note: `Data akurat belum tersedia. ${reason}`,
  };
}

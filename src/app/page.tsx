"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { loadDashboardData } from "@/lib/social/load-dashboard";
import type {
  DashboardCredentials,
  DashboardInputs,
  SocialPlatformData,
} from "@/lib/social/types";

const defaultInputs: DashboardInputs = {
  youtube: "youtube.com/davidgtech",
  tiktok: "tiktok.com/@davidgtech",
  instagram: "instagram.com/davidgtech",
};

const defaultCredentials: DashboardCredentials = {
  youtubeApiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ?? "",
  tiktokAccessToken: process.env.NEXT_PUBLIC_TIKTOK_ACCESS_TOKEN ?? "",
  instagramAccessToken: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN ?? "",
  instagramUserId: process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID ?? "",
};

function formatCount(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "N/A";
  }
  return new Intl.NumberFormat("id-ID").format(value);
}

function prettyDate(value?: string): string {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function platformLabel(platform: SocialPlatformData["platform"]): string {
  if (platform === "youtube") return "YouTube";
  if (platform === "tiktok") return "TikTok";
  return "Instagram";
}

export default function Home() {
  const [inputs, setInputs] = useState<DashboardInputs>(defaultInputs);
  const [credentials, setCredentials] =
    useState<DashboardCredentials>(defaultCredentials);
  const [platforms, setPlatforms] = useState<SocialPlatformData[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const knownTotals = useMemo(
    () =>
      platforms
        .map((platform) => platform.totalViews)
        .filter((value): value is number => typeof value === "number"),
    [platforms],
  );

  const totalAllViews = useMemo(
    () =>
      knownTotals.length > 0
        ? knownTotals.reduce((sum, value) => sum + value, 0)
        : null,
    [knownTotals],
  );

  const refreshData = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await loadDashboardData(inputs, credentials);
      setPlatforms(result.platforms);
      setFetchedAt(result.fetchedAt);
    } catch (refreshError) {
      const message =
        refreshError instanceof Error
          ? refreshError.message
          : "Gagal mengambil data dashboard.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="app-bg min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rise rounded-3xl border border-black/10 bg-[var(--card)] p-6 card-shadow sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                Multi Platform Analytics
              </p>
              <h1
                className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
                data-testid="dashboard-title"
              >
                Multi Social Views Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[var(--ink-soft)] sm:text-base">
                Pantau views YouTube, TikTok, dan Instagram dalam satu layar.
                Tekan tombol refresh untuk memuat data baru tanpa reload halaman.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-[var(--ink-soft)]">
                Total Views (All)
              </p>
              <p className="text-2xl font-bold">{formatCount(totalAllViews)}</p>
            </div>
          </div>
        </section>

        <section className="rise rounded-3xl border border-black/10 bg-[var(--card)] p-5 card-shadow sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold">YouTube Channel</span>
              <input
                className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                value={inputs.youtube}
                onChange={(event) =>
                  setInputs((prev) => ({ ...prev, youtube: event.target.value }))
                }
                placeholder="youtube.com/davidgtech"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold">TikTok Username</span>
              <input
                className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                value={inputs.tiktok}
                onChange={(event) =>
                  setInputs((prev) => ({ ...prev, tiktok: event.target.value }))
                }
                placeholder="tiktok.com/@davidgtech"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold">Instagram Username</span>
              <input
                className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                value={inputs.instagram}
                onChange={(event) =>
                  setInputs((prev) => ({ ...prev, instagram: event.target.value }))
                }
                placeholder="instagram.com/davidgtech"
              />
            </label>
          </div>

          <details className="mt-5 rounded-xl border border-black/10 bg-white/70 p-4">
            <summary className="cursor-pointer select-none text-sm font-semibold">
              Kredensial API Official (wajib untuk data akurat)
            </summary>
            <p className="mt-2 text-xs text-[var(--ink-soft)]">
              Dashboard ini tidak menampilkan angka simulasi. Jika key/token belum
              valid, status platform ditandai sebagai data tidak tersedia. Kamu
              bisa isi dari `.env.local` atau input manual di sini.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span>YouTube API Key</span>
                <input
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                  value={credentials.youtubeApiKey}
                  onChange={(event) =>
                    setCredentials((prev) => ({
                      ...prev,
                      youtubeApiKey: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span>TikTok Access Token</span>
                <input
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                  value={credentials.tiktokAccessToken}
                  onChange={(event) =>
                    setCredentials((prev) => ({
                      ...prev,
                      tiktokAccessToken: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span>Instagram Access Token</span>
                <input
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                  value={credentials.instagramAccessToken}
                  onChange={(event) =>
                    setCredentials((prev) => ({
                      ...prev,
                      instagramAccessToken: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span>Instagram User ID</span>
                <input
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 outline-none ring-[var(--brand)] transition focus:ring-2"
                  value={credentials.instagramUserId}
                  onChange={(event) =>
                    setCredentials((prev) => ({
                      ...prev,
                      instagramUserId: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
          </details>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--brand)] px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              onClick={refreshData}
              disabled={loading}
              data-testid="refresh-button"
            >
              {loading ? "Memuat data..." : "Refresh Data"}
            </button>
            <p className="text-xs text-[var(--ink-soft)]" data-testid="last-updated">
              Last update: {fetchedAt ? prettyDate(fetchedAt) : "Belum ada"}
            </p>
          </div>

          {error ? (
            <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {platforms.map((platform, index) => (
            <article
              key={platform.platform}
              data-testid={`card-${platform.platform}`}
              className="rise rounded-3xl border border-black/10 bg-[var(--card)] p-5 card-shadow"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={platform.profileImageUrl || "/window.svg"}
                    alt={`${platform.accountName} profile`}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-xl border border-black/10 bg-white object-cover"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--ink-soft)]">
                      {platformLabel(platform.platform)}
                    </p>
                    <h2 className="text-lg font-bold leading-tight">
                      {platform.accountName}
                    </h2>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                    platform.source === "official-api"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {platform.source === "official-api"
                    ? "Official API"
                    : "Unavailable"}
                </span>
              </header>

              <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-3">
                <p className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">
                  Total Views
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {formatCount(platform.totalViews)}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold">5 konten terbaru</p>
                {platform.contents.length === 0 ? (
                  <p className="mt-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs text-[var(--ink-soft)]">
                    Konten belum bisa ditampilkan karena kredensial API belum
                    tersedia atau belum valid.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm">
                    {platform.contents.slice(0, 5).map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-black/10 bg-white/80 px-3 py-2"
                      >
                        <a
                          className="line-clamp-1 font-medium text-[var(--foreground)] hover:underline"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.title}
                        </a>
                        <div className="mt-1 flex items-center justify-between text-xs text-[var(--ink-soft)]">
                          <span>Views: {formatCount(item.views)}</span>
                          <span>{prettyDate(item.publishedAt)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {platform.note ? (
                <p className="mt-3 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs text-[var(--ink-soft)]">
                  {platform.note}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

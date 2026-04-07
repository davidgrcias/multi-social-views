# Multi Social Views Dashboard

Web app Next.js + TypeScript untuk memantau views dari 3 platform sekaligus:

- YouTube
- TikTok
- Instagram

Dashboard menampilkan:

- nama akun
- foto profil
- total views
- views per konten (5 konten terbaru)
- refresh data tanpa reload halaman

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Playwright (automated UI test)
- GitHub Pages (static export deployment)

## Jalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Testing Otomatis

```bash
npx playwright install chromium
npm run test:e2e
```

## API Legal Notes (Context7 Summary)

Implementasi sudah mengikuti endpoint resmi yang terdokumentasi:

1. YouTube Data API v3
2. TikTok Display API
3. Instagram Graph API

Catatan penting dari dokumentasi resmi:

1. YouTube mendukung `channels.list` + `forHandle`, serta `playlistItems.list` dan `videos.list` untuk statistik views.
2. TikTok Display API butuh OAuth token dengan scope `user.info.basic` dan `video.list`.
3. Instagram views/insights hanya tersedia untuk akun Business/Creator dengan permission insights yang sesuai.

Karena itu, aplikasi punya 2 status:

1. Official API mode (data valid tampil)
2. Unavailable mode (tanpa angka simulasi jika key/token tidak valid)

Catatan integritas data:

1. Aplikasi tidak mengarang angka views.
2. Jika data official tidak bisa diambil, nilai ditampilkan sebagai tidak tersedia.

## Kredensial (Wajib Untuk Akurasi)

Isi di panel kredensial pada UI, atau set lewat `.env.local`:

```bash
# Opsi A (disarankan)
NEXT_PUBLIC_YOUTUBE_API_KEY=
NEXT_PUBLIC_TIKTOK_ACCESS_TOKEN=
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=
NEXT_PUBLIC_INSTAGRAM_USER_ID=

# Opsi B (nama biasa juga didukung)
YOUTUBE_API_KEY=
TIKTOK_ACCESS_TOKEN=
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_USER_ID=
```

Setelah mengubah `.env.local`, restart `npm run dev` agar nilai terbaca.

## Deploy GitHub Pages

Project sudah dikonfigurasi static export (`output: "export"`) dan workflow deploy otomatis:

- `.github/workflows/deploy-pages.yml`

Setelah push ke branch `main`, GitHub Actions akan:

1. build project
2. generate folder `out`
3. deploy ke GitHub Pages

## Struktur Penting

- `src/app/page.tsx` - dashboard UI + refresh logic
- `src/lib/social/adapters/youtube.ts` - YouTube official adapter
- `src/lib/social/adapters/tiktok.ts` - TikTok official adapter
- `src/lib/social/adapters/instagram.ts` - Instagram official adapter
- `src/lib/social/load-dashboard.ts` - orkestrasi loader + fallback
- `tests/dashboard.spec.ts` - Playwright e2e

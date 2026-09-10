<div align="center">

# Zydit TTS

**A privacy-first, zero-cloud-storage text-to-speech studio.**

Rendered in memory. Stored exclusively on your device.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)](https://tailwindcss.com)
[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-f38020)](https://deploy.workers.cloudflare.com/?url=https://github.com/anomalic1/mega-tts)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/anomalic1/mega-tts)

</div>

---

## What is this?

Zydit TTS is a fully client-side text-to-speech studio powered by ElevenLabs
`eleven_multilingual_v2` through any OpenAI-compatible `/v1/audio/speech`
endpoint. There is no backend: every request goes straight from your browser
to the endpoint you configure, the audio is rendered in memory, and your
history lives only in this browser's IndexedDB.

- **Zero-Retention Audio Engine** — audio is rendered in memory, stored exclusively on your device
- **46 curated voices** with gender / accent / tone tags and live-synthesized previews
- **Dynamic endpoint resolver** — paste any base URL; `/v1/audio/speech` is appended automatically
- **Real-time canvas visualizer** driven by the Web Audio API `AnalyserNode`
- **Local-only history** (IndexedDB via Dexie) with one-click purge
- **Optional Firebase auth** with a first-class guest mode — the app works fully without an account
- **Lossless `.mp3` download** — a byte-for-byte copy of what the engine rendered

## Architecture

```
┌────────────┐   POST /v1/audio/speech   ┌──────────────────┐
│   Studio   │ ─────────────────────────▶│  Your endpoint   │
│  (React)   │◀────────────────────────── │  (OpenAI-comp.) │
└─────┬──────┘      mp3 (streamed)       └──────────────────┘
      │
      ├──▶ PlayerContext ──▶ <audio> ─ MediaElementSource ─ AnalyserNode
      │                        │                                    │
      │                        ▼                                    ▼
      │                   AudioPlayer (transport)         AudioVisualizer (canvas)
      │
      └──▶ Dexie / IndexedDB ──▶ HistoryPanel (live query)
                    │
            "Purge Local Storage" ──▶ gone, irreversibly
```

**State model:** three focused React contexts — `Settings` (endpoint + key +
custom voices), `Auth` (Firebase or guest), `Player` (one shared `<audio>`
element and analyser) — plus Dexie live queries for history. No Redux, no
Zustand; if the app grows multi-page shared state, Zustand is the migration
path.

**Endpoint precedence:**

1. User-entered base URL in API Settings (persisted in `localStorage`)
2. `VITE_TTS_API_BASE_URL` (set on Cloudflare Pages)
3. Nothing configured → the studio calmly asks for an endpoint. Never an error screen.

**Model selection** is pinned to `eleven_multilingual_v2` in the frontend
(`src/data/models.ts`) — deliberately not env-driven, so a missing variable can
never break generation. Other model IDs appear as "coming soon" chips.

**Pitch & speed:** speed is sent to the API when supported; pitch is applied
at playback time (playback-rate with `preservesPitch = false`), so it is *not*
baked into the downloaded mp3 — the UI says so honestly.

## Privacy

| Stored where | What | Lifetime |
|---|---|---|
| IndexedDB | rendered audio + metadata | until you purge it |
| `localStorage` | endpoint base URL, custom voice names | until you clear it |
| `sessionStorage` | your API key | wiped when the tab closes |
| Cloud | **nothing** | — |

No analytics, no cookies, no server-side logs from this app. The Bearer key you
enter is attached to requests from your browser and visible in DevTools by
design — use a key you trust with your endpoint.

## Local setup

```bash
git clone https://github.com/anomalic1/mega-tts.git
cd mega-tts
npm install
cp .env.example .env.local   # optional — everything works with no env at all
npm run dev
```

Then open the studio, click the gear icon, and point it at your
OpenAI-compatible speech endpoint.

### Environment variables

All optional. The app degrades gracefully with none of them set.

| Variable | Purpose |
|---|---|
| `VITE_TTS_API_BASE_URL` | Default speech endpoint; `/v1/audio/speech` auto-appended |
| `VITE_FIREBASE_API_KEY` | Firebase web config — enables auth (see below) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `xxx.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Optional |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Optional |
| `VITE_FIREBASE_APP_ID` | Required with the others to enable auth |

### Firebase auth setup

See **[docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** — enabling Google and
email/password sign-in, authorized domains for `zydit.in`, and the
locked-down security rules posture (this app performs **zero** Firestore /
Storage reads or writes).

## Deploying to Cloudflare Pages

Open [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages →
Create → Pages → Connect to Git**, select this repository, then:

- **Framework preset:** Vite (or None — either works)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** set `VITE_TTS_API_BASE_URL` (and optionally the
  `VITE_FIREBASE_*` keys) for **Production and Preview**

After the first deploy: **Custom domains → Set up a domain → `zydit.in`**.
`public/_headers` (security headers) is picked up automatically by Pages.

## Alternative: Cloudflare Workers

The same static output can be deployed as a **Worker with static assets**
(Cloudflare's newer hosting model) — the repo ships a `wrangler.jsonc` for
this, plus the deploy button at the top of this README:

```bash
npm run deploy        # builds, then `wrangler deploy`
```

Workers Builds settings if configuring by hand: build command `npm run build`,
deploy command `npx wrangler deploy`. Note that `_headers` only applies on
Pages, not Workers static assets.

## Troubleshooting

- **"Could not reach the speech endpoint"** — the endpoint is either offline
  or does not allow browser requests (CORS). ElevenLabs' API does not send
  CORS headers for direct browser calls; use a gateway or proxy that does.
- **Voice previews do nothing** — previews are synthesized live through your
  endpoint; configure the endpoint first.
- **History disappeared** — IndexedDB can be evicted by the browser under
  storage pressure. The app requests persistent storage on first generation,
  but browsers may still decline. Keep what matters downloaded.

## Attribution

Architected & Crafted by **anomalous** — [github.com/anomalic1](https://github.com/anomalic1)

## License

Released under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International](https://creativecommons.org/licenses/by-nc-sa/4.0/) license —
see [LICENSE](LICENSE).

In plain English: you are free to share and adapt this work for
**non-commercial** purposes, as long as you **credit** the original author
and release adaptations under the **same license**. For commercial-use
inquiries, please open an issue or contact the author.

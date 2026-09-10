<div align="center">

# Zydit TTS

**A privacy-first, zero-cloud-storage text-to-speech studio.**

Rendered in memory. Stored exclusively on your device.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-brightgreen)](https://github.com/anomalic1/mega-tts)
[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8)](https://tailwindcss.com)
[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-f38020)](https://deploy.workers.cloudflare.com/?url=https://github.com/anomalic1/mega-tts)

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020)](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages)

</div>

---

## What is this?

Zydit TTS is a fully client-side text-to-speech studio powered by ElevenLabs
`eleven_multilingual_v2` through any OpenAI-compatible `/v1/audio/speech`
endpoint. There is no backend: every request goes straight from your browser
to the endpoint you configure, the audio is rendered in memory, and your
history lives only in this browser's IndexedDB.

**This project is open source** — browse, clone, and contribute at
[github.com/anomalic1/mega-tts](https://github.com/anomalic1/mega-tts).

- **Multi-page app** — `/` landing, `/studio` (studio + local history), `/signin`, `/about`, with SPA fallback via `public/_redirects`
- **Zero-Retention Audio Engine** — audio is rendered in memory, stored exclusively on your device
- **20 curated multilingual voices** with gender / accent / age / archetype tags, per-voice language support (18 languages), and live-synthesized previews
- **Dynamic endpoint resolver** — paste any base URL; `/v1/audio/speech` is appended automatically
- **Real-time canvas visualizer** driven by the Web Audio API `AnalyserNode`
- **Local-only history** (IndexedDB via Dexie) with one-click purge
- **Google sign-in gate** — the studio requires a one-click Google account; guest access can be re-enabled with one flag (`src/config.ts` → `REQUIRE_SIGN_IN = false`)
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
never break generation.

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

Start by **forking this repository** (Fork button, top-right) — you'll deploy
from your own fork, so you keep full control of the code and configuration.

Then clone **your fork** and run it locally:

```bash
git clone https://github.com/<your-username>/mega-tts.git
cd mega-tts
npm install
cp .env.example .env.local   # optional — everything works with no env at all
npm run dev
```

Then open the studio, click the gear icon, and point it at your
OpenAI-compatible speech endpoint.

### Managed API proxy (hide your key & model ID)

A production deployment can keep the real upstream endpoint, API key, and raw
model ID completely out of the browser:

```
Browser ──POST /api/speech──▶ Pages Function ──POST──▶ Your gateway
        ◀─────── audio (streamed through, never stored) ───────┘
```

The frontend calls a same-origin **Pages Function** (`functions/api/speech.ts`)
which injects the server-side `TTS_*` variables and streams the audio back.
Users only ever see "ElevenLabs Multilingual v2" in the model selector.

To enable, set these in Cloudflare Pages → Settings → Environment variables
(Production + Preview):

| Variable | Server-side? | Purpose |
|---|---|---|
| `VITE_MANAGED_API` | no (public flag) | `"true"` routes all generation through `/api/speech` |
| `TTS_API_BASE_URL` | **yes — never in the bundle** | Your gateway's base URL (`/v1/audio/speech` auto-appended) |
| `TTS_API_KEY` | **yes — never in the bundle** | Bearer key, attached only by the Function |
| `TTS_MODEL_ID` | **yes — never in the bundle** | The real model ID your gateway calls (UI still shows "Multilingual v2") |

Bonus: because the browser talks only to your own domain, CORS problems with
the upstream endpoint disappear entirely. The audio still never touches disk
anywhere — the Function is a pure pass-through with `Cache-Control: no-store`.

> Local testing of managed mode: `npm run build && npx wrangler pages dev`
> (the Function only runs under Pages, not under plain `vite`).

## Environment variables

Two kinds — the distinction matters:

All optional. The app degrades gracefully with none of them set.

| Variable | Kind | Purpose |
|---|---|---|
| `VITE_MANAGED_API` | public | `"true"` = use the `/api/speech` proxy (see above) |
| `TTS_API_BASE_URL` | **server-side** | Real gateway base URL — only the proxy reads it |
| `TTS_API_KEY` | **server-side** | Real API key — only the proxy attaches it |
| `TTS_MODEL_ID` | **server-side** | Real model ID — the UI label never changes |
| `VITE_TTS_API_BASE_URL` | public | Default endpoint for unmanaged mode; users can override in-app |
| `VITE_FIREBASE_API_KEY` | public | Firebase web config — enables auth (see below) |
| `VITE_FIREBASE_AUTH_DOMAIN` | public | `xxx.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | public | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | public | Optional |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | public | Optional |
| `VITE_FIREBASE_APP_ID` | public | Required with the others to enable auth |

All `VITE_*` variables end up in the client bundle and are readable by
visitors — that is why the real key and model ID live in the server-side
`TTS_*` variables instead.

### Firebase auth setup

See **[docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)** — enabling Google
sign-in (the only provider, and required to use the studio), authorized
domains for `zydit.in`, and the
locked-down security rules posture (this app performs **zero** Firestore /
Storage reads or writes).

## Deploying to Cloudflare Pages

**Fork this repo first**, then deploy from your fork:

1. Click **Fork** (top-right of this page) — this copies the project to your
   GitHub account.
2. Open [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers &
   Pages → Create → Pages → Connect to Git**, and select **your fork** of
   `mega-tts`.
3. Set:
   - **Framework preset:** Vite (or None — either works)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variables:** `VITE_TTS_API_BASE_URL` (your speech
     endpoint), and optionally the `VITE_FIREBASE_*` keys — for both
     **Production and Preview**
4. **Save and Deploy** — every push to your fork now redeploys automatically.
5. After the first deploy: **Custom domains → Set up a domain** to serve it
   on your own domain. `public/_headers` (security headers) is picked up
   automatically by Pages.

## Deploying from the CLI (optional)

Prefer deploying from your machine instead of the Git integration?

```bash
npm run deploy        # builds, then `wrangler pages deploy`
```

The repo ships a `wrangler.jsonc` in Pages form (`pages_build_output_dir:
"dist"`), so Wrangler knows exactly what to upload.

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

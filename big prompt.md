You are an elite Principal Frontend Architect and Apple-inspired UI/UX Designer. Build a production-grade, open-source web application for **"Zydit TTS"** (hosted at zydit.in), powered by the ElevenLabs `eleven_multilingual_v2` model with an OpenAI-compatible `/v1/audio/speech` audio endpoint.

---

### 1. Design Philosophy & Visual Aesthetic
- **Apple Human Interface Inspired:** Minimalist, sleek, high-contrast typography (SF Pro / Inter font stack), subtle border highlights (`border-white/10`), ultra-smooth glassmorphism (`backdrop-blur-xl bg-black/40`), and frictionless micro-interactions via Framer Motion.
- **Strictly No Generic AI Boilerplate:** Avoid loud purple-to-cyan gradients or noisy AI particles. Use deep obsidian/zinc blacks, warm titanium grays, and precise, purposeful accent lighting (single subtle accent hue like electric blue or monochrome silver).
- **Sensory Micro-Interactions:** Subtle hover lifts, spring-physics modals, tactile button clicks, and responsive audio visualizers.

---

### 2. Core Functional Requirements

#### A. Interactive TTS Studio (Home / Hero)
- **Voice Synthesis Playground:**
  - Multilingual input textarea with character count, reading time estimate, and pre-built preset scripts (Casual Conversation, Narrative Audio, Professional Presentation).
  - Model selector defaulted to `eleven_multilingual_v2`, with extensible support for `eleven_turbo_v2_5` and OpenAI-compatible IDs (`tts-1`, `tts-1-hd`).
  - Voice selector cards featuring visual accent tags (Gender, Accent, Tone) and instant preview samples.
  - Parameter controls: Speed (0.5x – 2.0x), Pitch, and Stability / Expressiveness sliders.
- **Dynamic Endpoint Resolver:**
  - Allow users in an "API Settings" dialog to input a custom API Base URL.
  - Automatically sanitize input: if `/v1/audio/speech` is missing from the path, append it seamlessly.
  - Pull default fallback from environment variables (`import.meta.env.VITE_TTS_API_BASE_URL`).
  - Request headers must support optional user-supplied Bearer API Keys (stored only in `sessionStorage`).

#### B. Privacy-First "Zero Cloud Storage" Architecture
- Prominently display a security assurance badge: **"Zero-Retention Audio Engine — Rendered in memory, stored exclusively on your device."**
- Implement client-side storage (IndexedDB via Dexie or local `caches`) for audio history.
- Built-in Audio Player component with:
  - Dynamic canvas waveform visualizer using Web Audio API (`AnalyserNode`).
  - Scrubber, speed toggle, volume slider, loop mode, and 1-click lossless `.mp3` download.
  - Complete "Purge Local Storage" trigger to give users instant control over their data.

#### C. Authentication Module
- Clean modal or dedicated view for **Sign In / Sign Up** powered by Firebase Auth:
  - Google One-Tap / Popup OAuth.
  - Email & Password with fluid validation feedback.
  - Guest mode fallback allowing instant trial generation without requiring an account.

#### D. About & Attribution Section
- A dedicated, beautifully formatted section detailing the mission of Zydit TTS.
- Prominent developer attribution card:
  - Text: **"Architected & Crafted by anomalous"**
  - Direct link to GitHub: `https://github.com/anomalic1` with custom GitHub avatar pull and repo link.

---

### 3. Technical Stack & Deployment Targets
- **Framework:** React 19 + TypeScript + Vite.
- **Styling:** Tailwind CSS v4 + Lucide React (feather/minimal icons) + `clsx` / `tailwind-merge`.
- **Motion:** Framer Motion for layout transitions and sheet drawers.
- **Audio:** Web Audio API for playback analysis and real-time visualization.
- **Hosting Target:** Cloudflare Pages ready (zero Node-specific runtime dependencies; all env variables prefixed with `VITE_`).

---

### 4. Codebase Architecture & Key Files to Generate
Provide modular, production-ready code with complete implementations:
1. `src/lib/api.ts`: Custom fetch client handling dynamic endpoint sanitization (`/v1/audio/speech`), stream ingestion, and Blob conversion.
2. `src/lib/firebase.ts`: Firebase Auth initialization with graceful fallback when config keys are absent.
3. `src/components/Studio.tsx`: The primary generation interface and parameter drawer.
4. `src/components/AudioVisualizer.tsx`: Canvas-based real-time reactive audio waveform.
5. `src/components/AboutSection.tsx`: Apple-style grid highlighting local privacy and anomalic1 attribution.
6. `.env.example`: Complete environment variable schema for Cloudflare Pages.
7. `README.md`: High-end, open-source documentation featuring GitHub badges, architecture summary, local setup guide, and 1-click Cloudflare Pages deployment button.
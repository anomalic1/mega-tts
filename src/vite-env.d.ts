/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OpenAI-compatible TTS base URL; /v1/audio/speech is auto-appended if missing. */
  readonly VITE_TTS_API_BASE_URL?: string
  /** "true" routes all generation through the same-origin /api/speech proxy. */
  readonly VITE_MANAGED_API?: string
  /** Firebase Auth — all optional. App runs in guest mode when absent. */
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

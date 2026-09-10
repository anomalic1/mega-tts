/**
 * Model catalog. The active model is pinned to Eleven Multilingual v2 —
 * the ID lives here, in the frontend, never in environment variables.
 * Future models render as non-interactive "coming soon" chips.
 */

export const DEFAULT_MODEL = 'eleven_multilingual_v2'

export interface TtsModel {
  id: string
  label: string
  note: string
  status: 'active' | 'soon'
}

export const TTS_MODEL_CATALOG: readonly TtsModel[] = [
  {
    id: 'eleven_multilingual_v2',
    label: 'Multilingual v2',
    note: 'Highest fidelity · 29 languages',
    status: 'active',
  },
  {
    id: 'eleven_turbo_v2_5',
    label: 'Turbo v2.5',
    note: 'Low latency · Coming soon',
    status: 'soon',
  },
  {
    id: 'tts-1',
    label: 'OpenAI tts-1',
    note: 'Coming soon',
    status: 'soon',
  },
  {
    id: 'tts-1-hd',
    label: 'OpenAI tts-1-hd',
    note: 'Coming soon',
    status: 'soon',
  },
] as const

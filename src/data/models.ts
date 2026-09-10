/**
 * Model catalog. The active model is pinned to Eleven Multilingual v2 —
 * the ID lives here, in the frontend, never in environment variables.
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
] as const

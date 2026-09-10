/* ── Voices ───────────────────────────────────────────────────────────────── */

export type VoiceGender = 'Male' | 'Female' | 'Neutral'

export type VoiceAccent =
  | 'American'
  | 'British'
  | 'Australian'
  | 'Italian'
  | 'Swedish'
  | 'Neutral'

export type VoiceTone =
  | 'narration'
  | 'conversational'
  | 'character'
  | 'news'
  | 'audiobook'
  | 'commercial'
  | 'animation'
  | 'documentary'

export interface VoicePreset {
  /** ElevenLabs voice_id, e.g. "21m00Tcm4TlvDq8ikWAMC" */
  id: string
  name: string
  /** Short human description, shown on the voice card */
  description: string
  gender: VoiceGender
  accent: VoiceAccent
  tones: VoiceTone[]
  source: 'builtin' | 'custom'
}

/* ── Generation ───────────────────────────────────────────────────────────── */

export interface GenerationParams {
  model: string
  voiceId: string
  text: string
  /** 0–1, ElevenLabs voice_settings.stability */
  stability: number
  /** 0.5–2.0, sent to the API when supported */
  speed: number
  /** Playback-time pitch shift in semitones, −6…+6 (not baked into the mp3) */
  pitch: number
}

/* ── History ──────────────────────────────────────────────────────────────── */

export interface HistoryEntry {
  id?: number
  createdAt: number
  /** The rendered mp3 — lives only in this browser's IndexedDB */
  blob: Blob
  params: GenerationParams
  voiceName: string
  durationSec?: number
  sizeBytes: number
}

/* ── API ──────────────────────────────────────────────────────────────────── */

export interface ApiSettings {
  baseUrl: string
  apiKey: string
}

/** Typed, user-presentable error from the speech endpoint. */
export class ApiError extends Error {
  readonly status?: number
  readonly cause?: unknown

  constructor(message: string, status?: number, cause?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.cause = cause
  }
}

/* ── Auth ─────────────────────────────────────────────────────────────────── */

export interface AuthUser {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export type AuthMode = 'firebase' | 'guest'

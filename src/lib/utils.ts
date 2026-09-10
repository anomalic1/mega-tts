import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Compose Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SPEECH_PATH = '/v1/audio/speech'

/**
 * Sanitize a user- or env-supplied base URL into a full speech endpoint.
 *
 *   https://host                    → https://host/v1/audio/speech
 *   https://host/                   → https://host/v1/audio/speech
 *   https://host/v1                 → https://host/v1/audio/speech
 *   https://host/v1/audio/speech    → https://host/v1/audio/speech  (unchanged)
 *   ""                              → ""  (caller shows a calm hint, never an error)
 */
export function resolveSpeechEndpoint(input?: string): string {
  const raw = (input ?? import.meta.env.VITE_TTS_API_BASE_URL ?? '').trim()
  if (!raw) return ''

  // Strip trailing slashes, then any already-present speech path (case-insensitive).
  let base = raw.replace(/\/+$/, '').replace(new RegExp(SPEECH_PATH + '$', 'i'), '')

  // Tolerate "/v1" and "/v1/" endings.
  base = base.replace(/\/v1$/i, '')

  return `${base}${SPEECH_PATH}`
}

/** Rough reading-time estimate at a natural narration pace (~150 wpm). */
export function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return '0 sec'
  const totalSeconds = Math.max(1, Math.round((words / 150) * 60))
  if (totalSeconds < 60) return `${totalSeconds} sec`
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return seconds ? `${minutes} min ${seconds} sec` : `${minutes} min`
}

export function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Trigger a lossless download of a Blob (no re-encode, byte-for-byte copy). */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Semitone offset → playback-rate factor. */
export function pitchFactor(semitones: number): number {
  return Math.pow(2, semitones / 12)
}

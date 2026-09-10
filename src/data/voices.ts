import type { VoiceAccent, VoiceAge, VoiceArchetype, VoiceLanguage, VoicePreset } from '@/types'

/**
 * Built-in voice catalog — the 20 current-generation ElevenLabs multilingual
 * voices, with gender / accent / age / archetype tags and per-voice language
 * support derived from the multilingual v2 locale matrix.
 * Extend at runtime with custom voice IDs via the API Settings dialog.
 */

export const ACCENTS: readonly VoiceAccent[] = ['American', 'British', 'Australian']

export const AGES: readonly VoiceAge[] = ['Young', 'Young Adult', 'Middle-Aged', 'Older']

export const ARCHETYPES: readonly VoiceArchetype[] = [
  'conversational',
  'narration',
  'character',
]

export interface LanguageInfo {
  code: VoiceLanguage
  label: string
}

export const LANGUAGES: readonly LanguageInfo[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'cs', label: 'Czech' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tr', label: 'Turkish' },
  { code: 'fil', label: 'Filipino' },
  { code: 'ro', label: 'Romanian' },
]

export const VOICE_CATALOG: readonly VoicePreset[] = [
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Laid-back American everyman', gender: 'Male', accent: 'American', age: 'Middle-Aged', archetype: 'conversational', languages: ['en', 'fr', 'es', 'de', 'nl'], source: 'builtin' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Confident, warm young woman', gender: 'Female', accent: 'American', age: 'Young Adult', archetype: 'narration', languages: ['en', 'fr', 'es', 'hi', 'zh', 'ar'], source: 'builtin' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Sunny, quirky young woman', gender: 'Female', accent: 'American', age: 'Young', archetype: 'conversational', languages: ['en', 'fr', 'es', 'de', 'zh', 'ar'], source: 'builtin' },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', description: 'Neutral, calm and steady', gender: 'Female', accent: 'American', age: 'Middle-Aged', archetype: 'conversational', languages: ['en', 'fr', 'es', 'zh', 'pt', 'it'], source: 'builtin' },
  { id: 'SOYHLrjzK2X1ezoPC6cr', name: 'Harry', description: 'Fierce, rough-edged young man', gender: 'Male', accent: 'American', age: 'Young', archetype: 'character', languages: ['en'], source: 'builtin' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Energetic creator energy', gender: 'Male', accent: 'American', age: 'Young', archetype: 'character', languages: ['en', 'de', 'hi', 'zh', 'pt', 'pl', 'cs', 'tr'], source: 'builtin' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', description: 'Knowledgeable, engaging explainer', gender: 'Female', accent: 'American', age: 'Middle-Aged', archetype: 'narration', languages: ['en', 'fr', 'es', 'de', 'ar', 'it'], source: 'builtin' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', description: 'Chill, casual young man', gender: 'Male', accent: 'American', age: 'Young', archetype: 'conversational', languages: ['en', 'fr', 'es', 'de', 'zh', 'pt', 'cs', 'sk', 'sv', 'fil'], source: 'builtin' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', description: 'Bright, playful young woman', gender: 'Female', accent: 'American', age: 'Young', archetype: 'conversational', languages: ['en', 'fr', 'es', 'de', 'hi', 'zh', 'ar', 'ja', 'cs'], source: 'builtin' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', description: 'Smooth, agentic assistant voice', gender: 'Male', accent: 'American', age: 'Middle-Aged', archetype: 'conversational', languages: ['en', 'fr', 'es', 'de', 'zh', 'pt', 'sk'], source: 'builtin' },
  { id: 'hpp4J3VqNfWAUOO0d1Us', name: 'Bella', description: 'Crisp, engaging presenter', gender: 'Female', accent: 'American', age: 'Middle-Aged', archetype: 'narration', languages: ['en'], source: 'builtin' },
  { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', description: 'Natural, casual conversationalist', gender: 'Male', accent: 'American', age: 'Middle-Aged', archetype: 'conversational', languages: ['en', 'fr', 'hi', 'ar', 'pt', 'sv'], source: 'builtin' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', description: 'Resonant, comforting storyteller', gender: 'Male', accent: 'American', age: 'Middle-Aged', archetype: 'narration', languages: ['en', 'fr', 'de', 'hi', 'zh', 'ar', 'pt', 'nl', 'sk', 'ro'], source: 'builtin' },
  { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', description: 'Balanced, seasoned storyteller', gender: 'Male', accent: 'American', age: 'Older', archetype: 'narration', languages: ['en', 'fr', 'es', 'de', 'hi', 'zh', 'ar', 'pt', 'it', 'cs'], source: 'builtin' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', description: 'Gravelly trickster energy', gender: 'Male', accent: 'American', age: 'Middle-Aged', archetype: 'character', languages: ['en', 'fr', 'hi'], source: 'builtin' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'British storyteller baritone', gender: 'Male', accent: 'British', age: 'Middle-Aged', archetype: 'character', languages: ['en', 'fr', 'es', 'hi', 'ar', 'ja', 'cs', 'fil'], source: 'builtin' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', description: 'Clear British educator', gender: 'Female', accent: 'British', age: 'Middle-Aged', archetype: 'narration', languages: ['en', 'fr', 'hi', 'zh', 'ar', 'it', 'ja', 'pl'], source: 'builtin' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Formal British broadcaster', gender: 'Male', accent: 'British', age: 'Middle-Aged', archetype: 'narration', languages: ['en', 'de', 'tr'], source: 'builtin' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Velvety British news reader', gender: 'Female', accent: 'British', age: 'Middle-Aged', archetype: 'narration', languages: ['en', 'de', 'zh', 'it', 'ja', 'nl', 'pl', 'cs'], source: 'builtin' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Hyped, confident Aussie', gender: 'Male', accent: 'Australian', age: 'Young', archetype: 'character', languages: ['en', 'es', 'zh', 'pt', 'fil'], source: 'builtin' },
] as const

export const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah

/** Canned line used for on-demand voice previews (synthesized, never bundled). */
export function previewLine(name: string): string {
  return `Hi, I'm ${name}. This is how I sound — let me know if I'm the right voice for you.`
}

/** Fold user-added custom voices (from API Settings) into the catalog. */
export function mergeCustomVoices(
  custom: ReadonlyArray<{ id: string; name: string }>,
): VoicePreset[] {
  const mapped: VoicePreset[] = custom.map((v) => ({
    id: v.id,
    name: v.name,
    description: 'Custom voice',
    gender: 'Neutral',
    accent: 'American',
    archetype: 'conversational',
    // Language support is unknown for custom IDs — never filtered out.
    languages: [],
    source: 'custom',
  }))
  return [...VOICE_CATALOG, ...mapped]
}

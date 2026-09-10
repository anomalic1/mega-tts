import type { VoiceAccent, VoiceTone, VoicePreset } from '@/types'

/**
 * Built-in voice catalog — 46 curated ElevenLabs voices.
 * Tags (gender / accent / tones) are derived from each voice's description.
 * Extend at runtime with custom voice IDs via the API Settings dialog.
 */

export const ACCENTS: readonly VoiceAccent[] = [
  'American',
  'British',
  'Australian',
  'Italian',
  'Swedish',
  'Neutral',
]

export const TONES: readonly VoiceTone[] = [
  'narration',
  'conversational',
  'character',
  'news',
  'audiobook',
  'commercial',
  'animation',
  'documentary',
]

export const VOICE_CATALOG: readonly VoicePreset[] = [
  { id: '21m00Tcm4TlvDq8ikWAMC', name: 'Rachel', description: 'Calm, clear American female', gender: 'Female', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Strong, confident American female', gender: 'Female', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Soft, expressive American female', gender: 'Female', accent: 'American', tones: ['conversational', 'narration'], source: 'builtin' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Well-rounded, friendly American male', gender: 'Male', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'Emotional, young American female', gender: 'Female', accent: 'American', tones: ['conversational', 'character'], source: 'builtin' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', description: 'Deep, conversational American male', gender: 'Male', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp, narrator American male', gender: 'Male', accent: 'American', tones: ['narration'], source: 'builtin' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, narrative American male', gender: 'Male', accent: 'American', tones: ['narration'], source: 'builtin' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'Raspy, dynamic American male', gender: 'Male', accent: 'American', tones: ['character'], source: 'builtin' },
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', description: 'Expressive, warm American female', gender: 'Female', accent: 'American', tones: ['narration', 'conversational'], source: 'builtin' },
  { id: 'piTKgcLEGmPE4e6mEKli', name: 'Nicole', description: 'Soft, whispery American female', gender: 'Female', accent: 'American', tones: ['narration'], source: 'builtin' },
  { id: 'z9fAnlkpzviPz146aGWa', name: 'Glinda', description: 'Theatrical, dramatic female', gender: 'Female', accent: 'Neutral', tones: ['character'], source: 'builtin' },
  { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde', description: 'Gruff, character American male', gender: 'Male', accent: 'American', tones: ['character'], source: 'builtin' },
  { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave', description: 'Conversational, British Essex male', gender: 'Male', accent: 'British', tones: ['conversational'], source: 'builtin' },
  { id: 'D38z5RcWu1voky8WS1ja', name: 'Fin', description: 'Energetic, young male', gender: 'Male', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'jsCqWAovK2LkecY7zXl4', name: 'Freya', description: 'Expressive female', gender: 'Female', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'jBpfuIE2acCO8z3wKNLl', name: 'Gigi', description: 'Youthful, child-like animation voice', gender: 'Female', accent: 'Neutral', tones: ['animation'], source: 'builtin' },
  { id: 'zcAOhNBS3c14rBihAFp1', name: 'Giovanni', description: 'Foreign, Italian-accented male', gender: 'Male', accent: 'Italian', tones: ['character'], source: 'builtin' },
  { id: 'oWAxZDxUOHqnQvUqPCE5', name: 'Grace', description: 'Southern American female', gender: 'Female', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'SOYHLrjzK2X1ezoPC6cr', name: 'Harry', description: 'Anxious, dramatic young male', gender: 'Male', accent: 'Neutral', tones: ['character'], source: 'builtin' },
  { id: 'ZQe5CZNOzWyzPSCn5a3c', name: 'James', description: 'Calm, British news/narration male', gender: 'Male', accent: 'British', tones: ['news', 'narration'], source: 'builtin' },
  { id: 'bVMeCyTHy58xNoL34h3p', name: 'Jeremy', description: 'Excited, upbeat American male', gender: 'Male', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 't0jbIGfmCWtrdaEdqq93', name: 'Jessie', description: 'Raspy, mature female', gender: 'Female', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', description: 'Expressive, conversational female', gender: 'Female', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', description: 'Friendly, conversational middle-aged male', gender: 'Male', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', description: 'Casual, conversational American male', gender: 'Male', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', description: 'Deep, documentary narration male', gender: 'Male', accent: 'American', tones: ['documentary', 'narration'], source: 'builtin' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Authoritative, British news anchor', gender: 'Male', accent: 'British', tones: ['news'], source: 'builtin' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Warm, middle-aged British female', gender: 'Female', accent: 'British', tones: ['narration'], source: 'builtin' },
  { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', description: 'Trustworthy, mature/older American male', gender: 'Male', accent: 'American', tones: ['narration'], source: 'builtin' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', description: 'Friendly, casual young American male', gender: 'Male', accent: 'American', tones: ['conversational'], source: 'builtin' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Crisp, British baritone', gender: 'Male', accent: 'British', tones: ['narration'], source: 'builtin' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', description: 'Friendly, natural speaker', gender: 'Male', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Casual, relaxed Australian male', gender: 'Male', accent: 'Australian', tones: ['conversational'], source: 'builtin' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Seductive, mature Swedish/English female', gender: 'Female', accent: 'Swedish', tones: ['character'], source: 'builtin' },
  { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy', description: 'British story/narration female', gender: 'Female', accent: 'British', tones: ['narration'], source: 'builtin' },
  { id: 'LcfcDJNUP1GQjkzn1xUU', name: 'Emily', description: 'Calm, meditative female', gender: 'Female', accent: 'Neutral', tones: ['narration'], source: 'builtin' },
  { id: 'g5CIjZEefAph4nQFvHAz', name: 'Ethan', description: 'Youthful, narrator male', gender: 'Male', accent: 'Neutral', tones: ['narration'], source: 'builtin' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Articulate, neutral young male', gender: 'Male', accent: 'Neutral', tones: ['conversational'], source: 'builtin' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', description: 'Warm, pleasant female', gender: 'Female', accent: 'Neutral', tones: ['narration'], source: 'builtin' },
  { id: 'flq6f7yk4E4fJM5XTYuZ', name: 'Michael', description: 'Natural audiobook narrator male', gender: 'Male', accent: 'Neutral', tones: ['audiobook'], source: 'builtin' },
  { id: 'zrHiDhphv9ZnVXBqCLjz', name: 'Mimi', description: 'Cute, animated female', gender: 'Female', accent: 'Neutral', tones: ['animation'], source: 'builtin' },
  { id: 'ODq5zmih8GrVes37Dizd', name: 'Patrick', description: 'Shouty, character voice', gender: 'Male', accent: 'Neutral', tones: ['character'], source: 'builtin' },
  { id: '5Q0t7uMcjvnagumLfvZi', name: 'Paul', description: 'Grounded, professional male', gender: 'Male', accent: 'Neutral', tones: ['narration', 'commercial'], source: 'builtin' },
  { id: 'pMsXgVXv3BLzUgSXRplE', name: 'Serena', description: 'Pleasant, commercial female', gender: 'Female', accent: 'Neutral', tones: ['commercial'], source: 'builtin' },
  { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas', description: 'Calm, classic British male', gender: 'Male', accent: 'British', tones: ['narration'], source: 'builtin' },
] as const

export const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAMC' // Rachel

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
    accent: 'Neutral',
    tones: [],
    source: 'custom',
  }))
  return [...VOICE_CATALOG, ...mapped]
}

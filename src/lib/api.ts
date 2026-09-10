import { ApiError, type GenerationParams } from '@/types'
import { resolveSpeechEndpoint } from '@/lib/utils'

export interface SpeechRequestOptions {
  /** Endpoint base URL; falls back to VITE_TTS_API_BASE_URL, then ''. */
  baseUrl?: string
  /** Optional Bearer key — only sent when non-empty. */
  apiKey?: string
  /** Byte-level progress for streaming responses. */
  onProgress?: (bytesReceived: number) => void
  signal?: AbortSignal
}

const ELEVEN_MODEL_PREFIX = 'eleven_'

/**
 * Managed mode: the deployment runs the same-origin /api/speech Pages
 * Function (functions/api/speech.ts), which holds the real endpoint, key,
 * and model ID server-side. The user-facing model label stays
 * "ElevenLabs Multilingual v2" regardless of what the server actually calls.
 */
export const isManagedApi = import.meta.env.VITE_MANAGED_API === 'true'

function buildBody(params: GenerationParams): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: params.model,
    input: params.text,
    voice: params.voiceId,
    response_format: 'mp3',
    speed: params.speed,
  }
  // Provider-specific expressiveness controls — ignored by plain OpenAI-compatible
  // servers, consumed by ElevenLabs-compatible gateways.
  if (params.model.startsWith(ELEVEN_MODEL_PREFIX)) {
    body.voice_settings = {
      stability: params.stability,
      similarity_boost: 0.75,
    }
  }
  return body
}

/** Extract a human-readable message from either OpenAI- or ElevenLabs-style error bodies. */
async function parseErrorMessage(res: Response): Promise<string> {
  const fallback = `The speech service responded with ${res.status} ${res.statusText || ''}`.trim()
  try {
    const text = await res.text()
    if (!text) return fallback
    try {
      const json = JSON.parse(text) as {
        error?: { message?: string }
        detail?: { message?: string } | string
        message?: string
      }
      const message =
        json.error?.message ??
        (typeof json.detail === 'string' ? json.detail : json.detail?.message) ??
        json.message
      return message || fallback
    } catch {
      return text.length < 200 ? text : fallback
    }
  } catch {
    return fallback
  }
}

/**
 * POST to the (dynamically resolved) /v1/audio/speech endpoint and return the
 * rendered mp3 as a Blob. Streams the response body when available, falling
 * back to a buffered read. Never throws raw — always a typed ApiError.
 */
export async function synthesizeSpeech(
  params: GenerationParams,
  options: SpeechRequestOptions = {},
): Promise<Blob> {
  const endpoint = resolveSpeechEndpoint(options.baseUrl)
  if (!endpoint) {
    throw new ApiError('No speech endpoint configured yet. Add one in API Settings.')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'audio/mpeg',
  }
  // In managed mode the proxy injects credentials server-side; the client
  // never attaches (or possesses) a key.
  if (!isManagedApi && options.apiKey?.trim()) {
    headers.Authorization = `Bearer ${options.apiKey.trim()}`
  }

  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildBody(params)),
      signal: options.signal,
    })
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    throw new ApiError(
      'Could not reach the speech endpoint. It may be offline, or it may not allow browser requests (CORS).',
      undefined,
      err,
    )
  }

  if (!res.ok) {
    throw new ApiError(await parseErrorMessage(res), res.status)
  }

  // Prefer streaming ingestion: accumulate chunks into one Blob.
  if (res.body) {
    const reader = res.body.getReader()
    const chunks: BlobPart[] = []
    let received = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value as unknown as BlobPart)
        received += value.byteLength
        options.onProgress?.(received)
      }
    }
    return new Blob(chunks, { type: 'audio/mpeg' })
  }

  const buffer = await res.arrayBuffer()
  options.onProgress?.(buffer.byteLength)
  return new Blob([buffer], { type: 'audio/mpeg' })
}

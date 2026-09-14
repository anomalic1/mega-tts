interface Env {
  TTS_API_BASE_URL?: string
  TTS_API_KEY?: string
  TTS_MODEL_ID?: string
}

interface PagesContext {
  request: Request
  env: Env
}


function speechUrl(base: string): string {
  const b = base
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/v1\/audio\/speech$/i, '')
    .replace(/\/v1$/i, '')
  return `${b}/v1/audio/speech`
}

const json = (message: string, status: number) =>
  Response.json({ error: { message } }, { status })

export async function onRequestPost({ request, env }: PagesContext): Promise<Response> {
  const base = env.TTS_API_BASE_URL?.trim()
  if (!base) {
    return json(
      'The managed TTS endpoint is not configured. The deployment must be set with TTS_API_BASE_URL (see README.MD).',
      503,
    )
  }
  const model = env.TTS_MODEL_ID?.trim() || 'eleven_multilingual_v2'

  let client: Record<string, unknown>
  try {
    client = (await request.json()) as Record<string, unknown>
  } catch {
    return json('Invalid JSON body.', 400)
  }

  const input = typeof client.input === 'string' ? client.input.trim() : ''
  const voice = typeof client.voice === 'string' ? client.voice.trim() : ''
  if (!input || !voice) {
    return json('Both "input" (text) and "voice" (voice ID) are required.', 400)
  }

  const payload: Record<string, unknown> = {
    model,
    input,
    voice,
    response_format: 'mp3',
  }
  if (typeof client.speed === 'number') payload.speed = client.speed
  if (client.voice_settings && typeof client.voice_settings === 'object') {
    payload.voice_settings = client.voice_settings
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'audio/mpeg',
  }
  const key = env.TTS_API_KEY?.trim()
  if (key) headers.Authorization = `Bearer ${key}`

  let upstream: Response
  try {
    upstream = await fetch(speechUrl(base), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })
  } catch {
    return json('Could not reach the TTS endpoint.', 502)
  }


  if (!upstream.ok) {
    const contentType = upstream.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const text = await upstream.text()
      return new Response(text, {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return json(`This TTS service responded with ${upstream.status}.`, 502)
  }


  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}

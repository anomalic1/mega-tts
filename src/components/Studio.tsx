import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Settings2, SlidersHorizontal, Sparkles, Square } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ModelSelector } from '@/components/ModelSelector'
import { VoiceGrid } from '@/components/VoiceGrid'
import { ParameterSheet } from '@/components/ParameterSheet'
import { AudioPlayer } from '@/components/AudioPlayer'
import { useSettings } from '@/context/SettingsContext'
import { usePlayer } from '@/context/PlayerContext'
import { useToast } from '@/context/ToastContext'
import { synthesizeSpeech } from '@/lib/api'
import { putEntry, requestPersistentStorage } from '@/lib/db'
import { DEFAULT_MODEL } from '@/data/models'
import { DEFAULT_VOICE_ID, VOICE_CATALOG, mergeCustomVoices, previewLine } from '@/data/voices'
import { PRESET_SCRIPTS } from '@/data/presets'
import { estimateReadingTime, formatBytes } from '@/lib/utils'
import { ApiError, type GenerationParams, type HistoryEntry, type VoicePreset } from '@/types'

const CHAR_LIMIT = 5000

/**
 * The studio — the primary generation interface. Text, model, voice, and
 * parameters live here as local state; results flow into the shared player
 * and local history.
 */
export function Studio({
  onOpenSettings,
  restore,
  onRestoreConsumed,
}: {
  onOpenSettings: () => void
  restore: HistoryEntry | null
  onRestoreConsumed: () => void
}) {
  const { baseUrl, apiKey, isEndpointConfigured, customVoices } = useSettings()
  const player = usePlayer()
  const { toast } = useToast()

  const [text, setText] = useState('')
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID)
  const [params, setParams] = useState<Pick<GenerationParams, 'speed' | 'pitch' | 'stability'>>({
    speed: 1,
    pitch: 0,
    stability: 0.5,
  })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [received, setReceived] = useState(0)
  const [previewingId, setPreviewingId] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const previewCache = useRef(new Map<string, Blob>())
  const firstGenerate = useRef(true)

  const voices = useMemo(
    () => mergeCustomVoices(customVoices),
    [customVoices],
  )
  const selectedVoice = voices.find((v) => v.id === voiceId) ?? voices[0]

  // Restore a history entry's settings into the studio.
  useEffect(() => {
    if (!restore) return
    setText(restore.params.text)
    setVoiceId(restore.params.voiceId)
    setParams({
      speed: restore.params.speed,
      pitch: restore.params.pitch,
      stability: restore.params.stability,
    })
    toast(`Restored “${restore.voiceName}” with its original settings.`)
    onRestoreConsumed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restore])

  const patchParams = (patch: Partial<GenerationParams>) =>
    setParams((prev) => ({ ...prev, ...patch }))

  const generate = async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      toast('Write something first — the studio is listening.')
      return
    }
    if (!isEndpointConfigured) {
      onOpenSettings()
      toast('Add a speech endpoint in API Settings to start generating.')
      return
    }

    if (firstGenerate.current) {
      firstGenerate.current = false
      void requestPersistentStorage()
    }

    setGenerating(true)
    setReceived(0)
    abortRef.current = new AbortController()

    const fullParams: GenerationParams = {
      model: DEFAULT_MODEL,
      voiceId,
      text: trimmed,
      ...params,
    }

    try {
      const blob = await synthesizeSpeech(fullParams, {
        baseUrl,
        apiKey,
        onProgress: setReceived,
        signal: abortRef.current.signal,
      })
      const entryId = await putEntry({
        createdAt: Date.now(),
        blob,
        params: fullParams,
        voiceName: selectedVoice?.name ?? 'Voice',
        sizeBytes: blob.size,
      })
      player.load(blob, {
        voiceName: selectedVoice?.name ?? 'Voice',
        params: fullParams,
        entryId,
      })
      toast('Rendered locally — the audio never left your device.', 'success')
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        toast(
          err instanceof ApiError
            ? err.message
            : 'Generation failed. Check your endpoint in API Settings.',
          'error',
        )
      }
    } finally {
      setGenerating(false)
      abortRef.current = null
    }
  }

  const previewVoice = async (voice: VoicePreset) => {
    if (!isEndpointConfigured) {
      onOpenSettings()
      toast('Add a speech endpoint in API Settings to hear previews.')
      return
    }
    const cached = previewCache.current.get(voice.id)
    if (cached) {
      player.load(cached, { voiceName: voice.name, params: { model: DEFAULT_MODEL, voiceId: voice.id, text: '', ...params } })
      return
    }
    setPreviewingId(voice.id)
    try {
      const blob = await synthesizeSpeech(
        { model: DEFAULT_MODEL, voiceId: voice.id, text: previewLine(voice.name), ...params },
        { baseUrl, apiKey },
      )
      previewCache.current.set(voice.id, blob)
      player.load(blob, { voiceName: voice.name, params: { model: DEFAULT_MODEL, voiceId: voice.id, text: '', ...params } })
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        toast(err instanceof ApiError ? err.message : 'Preview failed.', 'error')
      }
    } finally {
      setPreviewingId(null)
    }
  }

  return (
    <section id="studio" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="glass-strong rounded-3xl p-5 sm:p-7"
      >
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Studio</h2>
          <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Fine-tune
          </Button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
            placeholder="Type or paste anything — any language, any length. Your words stay on this device."
            rows={5}
            className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 p-4 text-[15px] leading-relaxed text-zinc-100 placeholder:text-titanium-500/70 focus:border-accent/40 focus:outline-none"
            aria-label="Text to synthesize"
          />
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-titanium-500">
            <span className={text.length > CHAR_LIMIT * 0.9 ? 'text-amber-300/80' : undefined}>
              {text.length.toLocaleString()} / {CHAR_LIMIT.toLocaleString()}
            </span>
            <span>~{estimateReadingTime(text)} to listen</span>
            <div className="ml-auto flex flex-wrap items-center gap-1.5">
              {PRESET_SCRIPTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setText(preset.text)}
                  className="rounded-full px-2.5 py-1 text-[11px] text-titanium-400 ring-1 ring-white/10 transition-colors hover:text-zinc-100 hover:ring-white/25"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Model + voices */}
        <div className="mt-6 space-y-4">
          <ModelSelector value={DEFAULT_MODEL} onChange={() => undefined} />
          <VoiceGrid
            voices={voices}
            selectedId={voiceId}
            previewingId={previewingId}
            onPreview={(v) => void previewVoice(v)}
            onSelect={(v) => setVoiceId(v.id)}
          />
          <p className="text-[11.5px] text-titanium-500">
            {VOICE_CATALOG.length} built-in voices
            {customVoices.length > 0 && ` + ${customVoices.length} custom`}
            {' '}· previews are synthesized live through your endpoint and never stored.
          </p>
        </div>

        {/* Generate */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => void generate()}
            disabled={generating}
            className="min-w-44"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {received > 0 ? `Receiving ${formatBytes(received)}…` : 'Rendering…'}
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden />
                Generate speech
              </>
            )}
          </Button>

          {generating && (
            <Button variant="outline" onClick={() => abortRef.current?.abort()}>
              <Square className="size-3.5" aria-hidden />
              Cancel
            </Button>
          )}

          {!isEndpointConfigured && (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 text-xs text-titanium-500 transition-colors hover:text-zinc-300"
            >
              <Settings2 className="size-3.5" aria-hidden />
              No endpoint configured — set one up
            </button>
          )}
        </div>

        {/* Result */}
        <div className="mt-5">
          <AudioPlayer />
        </div>
      </motion.div>

      <ParameterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        params={params}
        onChange={patchParams}
      />
    </section>
  )
}

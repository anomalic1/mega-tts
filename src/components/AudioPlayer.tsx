import { useEffect, useState } from 'react'
import {
  Download,
  Gauge,
  Repeat,
  Trash2,
  Volume2,
  Pause,
  Play,
} from 'lucide-react'
import { usePlayer } from '@/context/PlayerContext'
import { useToast } from '@/context/ToastContext'
import { AudioVisualizer } from '@/components/AudioVisualizer'
import { deleteEntry } from '@/lib/db'
import { decodePeaks } from '@/lib/audio'
import { cn, downloadBlob, formatDuration } from '@/lib/utils'

const SPEED_STEPS = [0.75, 1, 1.25, 1.5, 2] as const

/**
 * The result player: visualizer + scrubber + transport + speed/volume/loop
 * + lossless .mp3 download. Pitch is a playback-time control (not baked in).
 */
export function AudioPlayer({ compact = false }: { compact?: boolean }) {
  const player = usePlayer()
  const { toast } = useToast()
  const [peaks, setPeaks] = useState<Float32Array | null>(null)

  // Decode a static peak overview for the scrubber-adjacent waveform.
  useEffect(() => {
    let cancelled = false
    setPeaks(null)
    if (player.track) {
      decodePeaks(player.track.blob)
        .then((p) => {
          if (!cancelled) setPeaks(p)
        })
        .catch(() => {
          /* visual overview is optional — live bars still work */
        })
    }
    return () => {
      cancelled = true
    }
  }, [player.track])

  if (!player.hasTrack || !player.track) return null

  const { meta } = player.track
  const progress = player.duration > 0 ? player.currentTime / player.duration : 0

  const cycleSpeed = () => {
    const idx = SPEED_STEPS.indexOf(player.speed as (typeof SPEED_STEPS)[number])
    player.setSpeed(SPEED_STEPS[(idx + 1) % SPEED_STEPS.length])
  }

  const handleDownload = () => {
    const ts = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')
    downloadBlob(player.track!.blob, `zydit-${meta.voiceName.toLowerCase()}-${ts}.mp3`)
    toast('Downloading the original mp3 — lossless, no re-encode.', 'success')
  }

  const handleDelete = async () => {
    if (meta.entryId != null) {
      await deleteEntry(meta.entryId)
    }
    player.close()
    toast('Removed from your local history.')
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <AudioVisualizer
        analyser={player.analyser}
        isPlaying={player.isPlaying}
        peaks={peaks}
        progress={progress}
        className={compact ? 'h-12' : 'h-16'}
      />

      {/* Scrubber */}
      <div className="relative px-4">
        <div className="pointer-events-none absolute inset-x-4 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full">
          <div
            className="h-full bg-accent transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={player.duration || 0}
          step={0.01}
          value={player.currentTime}
          onChange={(e) => player.seek(Number(e.target.value))}
          className="relative w-full"
          aria-label="Seek"
          disabled={!player.duration}
        />
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-1">
        <button
          onClick={player.togglePlay}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_16px_rgba(61,139,255,0.35)] transition-transform duration-150 hover:bg-[#5a9bff] active:scale-95"
          aria-label={player.isPlaying ? 'Pause' : 'Play'}
        >
          {player.isPlaying ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
        </button>

        <span className="ml-1 font-mono text-xs text-titanium-400 tabular-nums">
          {formatDuration(player.currentTime)} / {formatDuration(player.duration)}
        </span>

        <div className="ml-auto flex w-full items-center justify-end gap-1.5 sm:w-auto">
          <button
            onClick={cycleSpeed}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 font-mono text-xs text-zinc-300 transition-colors hover:border-white/20"
            aria-label={`Playback speed ${player.speed}x — click to change`}
          >
            <Gauge className="size-3.5 text-titanium-500" />
            {player.speed}x
          </button>

          <div className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5">
            <Volume2 className="size-3.5 text-titanium-500" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={player.volume}
              onChange={(e) => player.setVolume(Number(e.target.value))}
              className="w-16"
              aria-label="Volume"
            />
          </div>

          <button
            onClick={player.toggleLoop}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg border transition-colors',
              player.loop
                ? 'border-accent/40 bg-accent-soft text-[#7db4ff]'
                : 'border-white/10 bg-white/[0.03] text-titanium-400 hover:border-white/20',
            )}
            aria-label="Toggle loop"
            aria-pressed={player.loop}
          >
            <Repeat className="size-3.5" />
          </button>

          <button
            onClick={handleDownload}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-titanium-400 transition-colors hover:border-white/20 hover:text-zinc-100"
            aria-label="Download mp3"
            title="Download mp3"
          >
            <Download className="size-3.5" />
          </button>

          <button
            onClick={() => void handleDelete()}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-titanium-400 transition-colors hover:border-red-400/30 hover:text-red-300"
            aria-label="Delete from history"
            title="Delete from history"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-2 text-[11px] text-titanium-500">
        <span className="font-medium text-titanium-400">{meta.voiceName}</span>
        <span>·</span>
        <span>{meta.params.model}</span>
        {player.pitch !== 0 && (
          <>
            <span>·</span>
            <span>
              pitch {player.pitch > 0 ? '+' : ''}
              {player.pitch} semitones (playback only)
            </span>
          </>
        )}
      </div>
    </div>
  )
}

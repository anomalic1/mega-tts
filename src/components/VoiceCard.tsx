import { motion } from 'framer-motion'
import { Loader2, Play, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { VoicePreset } from '@/types'

const MAX_LANGUAGE_BADGES = 3

/**
 * Voice selector card: accent/gender/age tags, supported languages, and an
 * instant preview button (synthesized live — never bundled, never stored).
 */
export function VoiceCard({
  voice,
  selected,
  previewing,
  onPreview,
  onSelect,
}: {
  voice: VoicePreset
  selected: boolean
  previewing: boolean
  onPreview: (voice: VoicePreset) => void
  onSelect: (voice: VoicePreset) => void
}) {
  const shownLanguages = voice.languages.slice(0, MAX_LANGUAGE_BADGES)
  const overflowLanguages = voice.languages.slice(MAX_LANGUAGE_BADGES)

  return (
    <motion.button
      layout
      onClick={() => onSelect(voice)}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'glass group relative flex w-full flex-col gap-2 rounded-2xl p-3.5 text-left',
        'transition-[border-color,box-shadow] duration-200',
        selected
          ? 'border-accent/50 shadow-[0_0_0_1px_rgba(61,139,255,0.3),0_8px_28px_rgba(61,139,255,0.12)]'
          : 'hover:border-white/20',
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-medium text-zinc-100">{voice.name}</span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onPreview(voice)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              onPreview(voice)
            }
          }}
          className="flex size-7 items-center justify-center rounded-lg border border-white/10 text-titanium-400 opacity-0 transition-all duration-150 hover:border-accent/40 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Preview ${voice.name}`}
        >
          {previewing ? (
            <Loader2 className="size-3.5 animate-spin text-accent" />
          ) : (
            <Play className="size-3.5" />
          )}
        </span>
      </div>

      <p className="line-clamp-1 text-[11.5px] text-titanium-500">{voice.description}</p>

      <div className="flex flex-wrap items-center gap-1">
        <Badge>{[voice.accent, voice.gender, voice.age].filter(Boolean).join(' · ')}</Badge>
        {voice.source === 'custom' ? (
          <Badge tone="custom">
            <Sparkles className="mr-1 size-2.5" aria-hidden />
            Custom
          </Badge>
        ) : (
          <Badge tone="accent">{voice.archetype}</Badge>
        )}
      </div>

      {voice.source !== 'custom' && voice.languages.length > 0 && (
        <div className="flex flex-wrap items-center gap-1" aria-label="Supported languages">
          {shownLanguages.map((code) => (
            <span
              key={code}
              className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-titanium-400"
            >
              {code}
            </span>
          ))}
          {overflowLanguages.length > 0 && (
            <span
              title={`Also speaks: ${overflowLanguages.join(', ').toUpperCase()}`}
              className="rounded-md px-1 py-0.5 text-[9.5px] font-semibold text-titanium-500"
            >
              +{overflowLanguages.length}
            </span>
          )}
        </div>
      )}
    </motion.button>
  )
}

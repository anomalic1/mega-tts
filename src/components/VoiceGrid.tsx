import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ACCENTS, TONES } from '@/data/voices'
import { VoiceCard } from '@/components/VoiceCard'
import { cn } from '@/lib/utils'
import type { VoiceGender, VoicePreset, VoiceTone } from '@/types'

const GENDERS: readonly VoiceGender[] = ['Male', 'Female', 'Neutral']

type Filter = { query: string; accent: string | null; gender: string | null; tone: string | null }

/** Searchable, filterable voice catalog — built-ins plus user-added customs. */
export function VoiceGrid({
  voices,
  selectedId,
  previewingId,
  onPreview,
  onSelect,
}: {
  voices: VoicePreset[]
  selectedId: string
  previewingId: string | null
  onPreview: (voice: VoicePreset) => void
  onSelect: (voice: VoicePreset) => void
}) {
  const [filter, setFilter] = useState<Filter>({ query: '', accent: null, gender: null, tone: null })

  const filtered = useMemo(() => {
    const q = filter.query.trim().toLowerCase()
    return voices.filter((v) => {
      if (q && !`${v.name} ${v.description}`.toLowerCase().includes(q)) return false
      if (filter.accent && v.accent !== filter.accent) return false
      if (filter.gender && v.gender !== filter.gender) return false
      if (filter.tone && !v.tones.includes(filter.tone as VoiceTone)) return false
      return true
    })
  }, [voices, filter])

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={cn(
        'h-7 rounded-full px-3 text-[11.5px] transition-colors',
        active
          ? 'bg-accent-soft text-[#7db4ff] ring-1 ring-accent/40'
          : 'text-titanium-500 ring-1 ring-white/10 hover:text-zinc-200 hover:ring-white/20',
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-titanium-500" aria-hidden />
          <input
            value={filter.query}
            onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
            placeholder="Search voices…"
            className="h-9 w-48 rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-[13px] text-zinc-200 placeholder:text-titanium-500 focus:border-accent/40 focus:outline-none"
            aria-label="Search voices"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {GENDERS.map((g) =>
            chip(g, filter.gender === g, () =>
              setFilter((f) => ({ ...f, gender: f.gender === g ? null : g })),
            ),
          )}
          {ACCENTS.map((a) =>
            chip(a, filter.accent === a, () =>
              setFilter((f) => ({ ...f, accent: f.accent === a ? null : a })),
            ),
          )}
          {TONES.map((t) =>
            chip(t, filter.tone === t, () =>
              setFilter((f) => ({ ...f, tone: f.tone === t ? null : t })),
            ),
          )}
        </div>
      </div>

      <div className="grid max-h-[22rem] grid-cols-2 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((voice) => (
          <VoiceCard
            key={voice.id}
            voice={voice}
            selected={voice.id === selectedId}
            previewing={previewingId === voice.id}
            onPreview={onPreview}
            onSelect={onSelect}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-[13px] text-titanium-500">
            No voices match those filters.
          </p>
        )}
      </div>
    </div>
  )
}

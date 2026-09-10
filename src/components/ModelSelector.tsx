import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { TTS_MODEL_CATALOG } from '@/data/models'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

/**
 * Segmented model control. The active model is pinned to Eleven Multilingual
 * v2 — the ID is set in the frontend (src/data/models.ts), never in env.
 * Future models appear as locked "coming soon" chips.
 */
export function ModelSelector({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[13px] font-medium text-zinc-200">Model</span>
      {TTS_MODEL_CATALOG.map((model) => {
        const isActive = model.id === value && model.status === 'active'
        const chip = (
          <button
            key={model.id}
            onClick={() => model.status === 'active' && onChange(model.id)}
            disabled={model.status !== 'active'}
            className={cn(
              'relative flex h-8 items-center gap-1.5 rounded-xl px-3 text-[13px] transition-colors',
              isActive
                ? 'text-zinc-100'
                : model.status === 'active'
                  ? 'border border-white/10 bg-white/[0.03] text-titanium-400 hover:border-white/20 hover:text-zinc-200'
                  : 'cursor-not-allowed border border-white/[0.06] bg-white/[0.02] text-titanium-500/50',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="model-pill"
                className="absolute inset-0 rounded-xl border border-accent/40 bg-accent-soft"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{model.label}</span>
            {model.status === 'soon' && <Lock className="relative size-3 opacity-60" aria-hidden />}
          </button>
        )
        return model.status === 'soon' ? (
          <Tooltip key={model.id} label={model.note}>
            {chip}
          </Tooltip>
        ) : (
          chip
        )
      })}
    </div>
  )
}

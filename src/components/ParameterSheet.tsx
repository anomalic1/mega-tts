import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { LabeledSlider } from '@/components/ui/LabeledSlider'
import { springSheet } from '@/lib/motion'
import type { GenerationParams } from '@/types'

/**
 * Parameter drawer: Speed / Pitch / Stability. Bottom sheet on small
 * screens, right-side drawer on large ones. Closes on Esc and backdrop.
 */
export function ParameterSheet({
  open,
  onClose,
  params,
  onChange,
}: {
  open: boolean
  onClose: () => void
  params: Pick<GenerationParams, 'speed' | 'pitch' | 'stability'>
  onChange: (patch: Partial<GenerationParams>) => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Voice parameters"
            initial={{ y: '100%', x: 0, opacity: 1 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.6 }}
            transition={springSheet}
            // Drawer from the right on lg, sheet from the bottom below it.
            className={
              'glass-strong fixed z-50 flex flex-col gap-6 rounded-t-3xl p-6 pb-10 lg:bottom-0 lg:left-auto lg:right-0 lg:top-14 lg:h-auto lg:w-96 lg:rounded-l-3xl lg:rounded-tr-none lg:pb-6 ' +
              'inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto'
            }
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">
                Fine-tune the voice
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-titanium-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
                aria-label="Close parameters"
              >
                <X className="size-4" />
              </button>
            </div>

            <LabeledSlider
              label="Speed"
              value={params.speed}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(speed) => onChange({ speed })}
              format={(v) => `${v.toFixed(2)}x`}
              leftLabel="0.5×"
              rightLabel="2.0×"
              hint="sent to the engine"
            />

            <LabeledSlider
              label="Pitch"
              value={params.pitch}
              min={-6}
              max={6}
              step={1}
              onChange={(pitch) => onChange({ pitch })}
              format={(v) => `${v > 0 ? '+' : ''}${v} semitones`}
              leftLabel="−6"
              rightLabel="+6"
              hint="applied at playback"
            />

            <LabeledSlider
              label="Stability"
              value={params.stability}
              min={0}
              max={1}
              step={0.05}
              onChange={(stability) => onChange({ stability })}
              format={(v) => `${Math.round(v * 100)}%`}
              leftLabel="Expressive"
              rightLabel="Stable"
            />

            <p className="text-[11.5px] leading-relaxed text-titanium-500">
              Lower stability lets the voice improvise emotionally; higher
              stability keeps it consistent and even. Pitch is a playback-time
              effect — it won&apos;t be baked into the downloaded mp3.
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

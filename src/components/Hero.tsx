import { motion } from 'framer-motion'
import { ArrowDown, AudioWaveform } from 'lucide-react'
import { PrivacyBadge } from '@/components/PrivacyBadge'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="flex flex-col items-center gap-6"
      >
        <div className="glass flex size-14 items-center justify-center rounded-2xl">
          <AudioWaveform className="size-6 text-accent" aria-hidden />
        </div>

        <h1 className="text-gradient max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Text to speech that never leaves your device.
        </h1>

        <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-titanium-400 sm:text-base">
          Zydit TTS is a studio-grade synthesis playground powered by ElevenLabs
          Multilingual v2. Your words are rendered in memory, played locally, and
          stored only where they belong — on your machine.
        </p>

        <PrivacyBadge />

        <a
          href="#studio"
          className="group mt-2 inline-flex items-center gap-2 text-sm text-titanium-400 transition-colors hover:text-zinc-100"
        >
          Open the studio
          <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden />
        </a>
      </motion.div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, AudioWaveform, Database, Lock, ShieldCheck, UserCheck } from 'lucide-react'
import { PrivacyBadge } from '@/components/PrivacyBadge'
import { REQUIRE_SIGN_IN } from '@/config'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Zero-Retention Audio Engine',
    body: 'Audio is rendered in memory and stored exclusively on your device. No server ever receives a copy.',
  },
  {
    icon: Database,
    title: 'Local-only history',
    body: 'Everything you generate lives in this browser’s IndexedDB — purgeable in one click, never synced.',
  },
  {
    icon: Lock,
    title: 'Keys that vanish',
    body: 'API keys live in sessionStorage and are wiped the moment you close the tab.',
  },
  {
    icon: UserCheck,
    title: 'One-click sign-in',
    body: 'Sign in with Google and start speaking — no forms, no passwords, nothing to remember.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: {
    duration: 0.5,
    ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
  },
}

export function Landing() {
  return (
    <>
      <section className="relative flex flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-36">
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

          <Link
            to="/studio"
            className="group mt-2 inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-medium text-white shadow-[0_0_0_1px_rgba(61,139,255,0.4),0_8px_24px_rgba(61,139,255,0.25)] transition-[background-color,transform] duration-150 hover:bg-[#5a9bff] active:scale-[0.97]"
          >
            Open the studio
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <p className="text-xs text-titanium-500">
            {REQUIRE_SIGN_IN ? 'Free Google sign-in required to use the studio.' : 'No account needed — try it as a guest.'}
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="glass rounded-2xl p-5 text-left"
            >
              <f.icon className="size-5 text-accent" aria-hidden />
              <h2 className="mt-3 text-[15px] font-medium text-zinc-100">{f.title}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-titanium-500">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}

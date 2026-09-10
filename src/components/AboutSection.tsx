import { motion } from 'framer-motion'
import { Database, HeartHandshake, Lock, ShieldCheck, Waves } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GithubIcon } from '@/components/ui/icons'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: {
    duration: 0.5,
    ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
  },
}

const CARDS = [
  {
    icon: ShieldCheck,
    title: 'Zero-Retention Audio Engine',
    body: 'Audio is rendered in memory, played through your browser, and stored exclusively on your device. No server ever receives a copy of what you hear.',
  },
  {
    icon: Database,
    title: 'Local-only history',
    body: 'Your generation history lives in IndexedDB inside this browser — never uploaded, never synced, purgeable in one click.',
  },
  {
    icon: Lock,
    title: 'Keys that vanish',
    body: 'API keys you enter are held in sessionStorage and wiped the moment you close the tab. The URL is the only thing remembered.',
  },
  {
    icon: HeartHandshake,
    title: 'One-click sign-in',
    body: 'A single Google sign-in gets you into the studio — no forms, no passwords, no friction.',
  },
]

/** About & attribution — the mission, the privacy grid, and the maker. */
export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <motion.div {...fadeUp} className="mb-8 max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight">About Zydit TTS</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-titanium-400">
          Zydit TTS exists on a simple premise: text-to-speech is a personal act.
          Whether you&apos;re drafting a story, rehearsing a talk, or hearing your
          words for the first time — that moment shouldn&apos;t be anyone&apos;s
          data but yours. So we built a studio where privacy isn&apos;t a setting.
          It&apos;s the architecture.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            className="glass rounded-2xl p-5"
          >
            <card.icon className="size-5 text-accent" aria-hidden />
            <h3 className="mt-3 text-[15px] font-medium text-zinc-100">{card.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-titanium-500">{card.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Attribution */}
      <motion.div
        {...fadeUp}
        className="glass mt-3 flex flex-col items-center gap-6 rounded-2xl p-8 sm:flex-row sm:p-10"
      >
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <div className="relative">
            <img
              src="https://github.com/anomalic1.png"
              alt="anomalous"
              width={72}
              height={72}
              loading="lazy"
              className="rounded-2xl border border-white/10"
            />
            <span className="absolute -bottom-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border border-obsidian-900 bg-accent">
              <Waves className="size-3 text-white" aria-hidden />
            </span>
          </div>
          <div>
            <p className="text-[15px] font-medium text-zinc-100">
              Architected &amp; Crafted by <span className="text-gradient">anomalous</span>
            </p>
            <a
              href="https://github.com/anomalic1"
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-titanium-400 transition-colors hover:text-accent"
            >
              <GithubIcon className="size-3.5" />
              github.com/anomalic1
            </a>
          </div>
        </div>

        <div className="sm:ml-auto sm:text-right">
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            <Badge tone="accent">React 19</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Tailwind v4</Badge>
            <Badge>Web Audio API</Badge>
            <Badge>Cloudflare Workers</Badge>
            <Badge tone="accent">CC BY-NC-SA 4.0</Badge>
          </div>
          <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-titanium-500">
            Open source under Creative Commons Attribution-NonCommercial-ShareAlike 4.0.
          </p>
        </div>
      </motion.div>
    </section>
  )
}

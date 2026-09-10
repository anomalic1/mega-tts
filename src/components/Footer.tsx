import { AudioWaveform } from 'lucide-react'
import { GithubIcon } from '@/components/ui/icons'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-titanium-500">
          <AudioWaveform className="size-4" aria-hidden />
          <span className="text-[13px]">Zydit TTS</span>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-titanium-500">
          No cloud storage. No analytics. Your audio is rendered in memory and
          stored exclusively on your device.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-titanium-500">
          <span>
            Released under{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-zinc-300"
            >
              CC BY-NC-SA 4.0
            </a>
          </span>
          <span className="text-white/15">·</span>
          <span>Architected &amp; Crafted by anomalous</span>
          <span className="text-white/15">·</span>
          <a
            href="https://github.com/anomalic1"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-300"
          >
            <GithubIcon className="size-3.5" />
            anomalic1
          </a>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { AudioWaveform } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-6 pb-20 pt-24 text-center">
      <AudioWaveform className="size-8 text-titanium-500" aria-hidden />
      <h1 className="text-3xl font-semibold tracking-tight">404</h1>
      <p className="max-w-sm text-[13px] leading-relaxed text-titanium-500">
        That page doesn&apos;t exist — and honestly, there&apos;s nothing
        sensitive to find here anyway.
      </p>
      <Link
        to="/"
        className="text-sm text-accent transition-colors hover:text-[#7db4ff]"
      >
        Back to home
      </Link>
    </div>
  )
}

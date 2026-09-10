import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

/** The security assurance badge — the app's privacy promise, stated plainly. */
export function PrivacyBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'glass inline-flex items-center gap-2.5 rounded-full px-4 py-2',
        className,
      )}
    >
      <ShieldCheck className="size-4 text-accent" aria-hidden />
      <p className="text-[13px] leading-tight text-zinc-300">
        <span className="font-medium text-zinc-100">Zero-Retention Audio Engine</span>
        <span className="text-titanium-500"> — Rendered in memory, stored exclusively on your device.</span>
      </p>
    </div>
  )
}

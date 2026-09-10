import { useEffect, useState } from 'react'
import { AudioWaveform, Settings, UserRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

/**
 * Sticky glass header. Owns no state beyond scroll-shadow; auth chip and
 * settings gear delegate to App-level dialogs.
 */
export function Navbar({
  onOpenAuth,
  onOpenSettings,
}: {
  onOpenAuth: () => void
  onOpenSettings: () => void
}) {
  const { user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300',
        scrolled ? 'border-b border-white/10 bg-black/40 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Zydit TTS — home">
          <AudioWaveform className="size-5 text-accent" aria-hidden />
          <span className="text-[15px] font-semibold tracking-tight">Zydit TTS</span>
        </a>

        <div className="ml-4 hidden items-center gap-5 text-[13px] text-titanium-400 sm:flex">
          <a href="#studio" className="transition-colors hover:text-zinc-100">Studio</a>
          <a href="#history" className="transition-colors hover:text-zinc-100">History</a>
          <a href="#about" className="transition-colors hover:text-zinc-100">About</a>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <button
              onClick={() => void signOut()}
              className="glass flex h-8 items-center gap-2 rounded-full px-2 pr-3 text-xs text-zinc-200 transition-colors hover:border-white/20"
              aria-label={`Signed in as ${user.displayName ?? user.email ?? 'user'} — sign out`}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="size-6 rounded-full" />
              ) : (
                <UserRound className="size-4 text-titanium-400" aria-hidden />
              )}
              <span className="max-w-32 truncate">{user.displayName ?? user.email}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-[13px] text-titanium-400 transition-colors hover:text-zinc-100"
            >
              Sign in
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex size-8 items-center justify-center rounded-lg text-titanium-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            aria-label="API settings"
            title="API settings"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </nav>
    </header>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AudioWaveform, Settings, UserRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useUi } from '@/context/UiContext'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/studio', label: 'Studio' },
  { to: '/about', label: 'About' },
] as const

/**
 * Sticky glass header. Route links via NavLink; the settings gear opens the
 * global API Settings dialog.
 */
export function Navbar() {
  const { user, signOut } = useAuth()
  const { openSettings } = useUi()
  const navigate = useNavigate()
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
        scrolled
          ? 'border-b border-white/10 bg-black/40 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Zydit TTS — home">
          <AudioWaveform className="size-5 text-accent" aria-hidden />
          <span className="text-[15px] font-semibold tracking-tight">Zydit TTS</span>
        </Link>

        <div className="ml-4 hidden items-center gap-5 text-[13px] text-titanium-400 sm:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-zinc-100',
                  isActive && 'text-zinc-100',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
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
              onClick={() => navigate('/signin')}
              className="text-[13px] text-titanium-400 transition-colors hover:text-zinc-100"
            >
              Sign in
            </button>
          )}

          <button
            onClick={openSettings}
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

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { AtSign, Ghost, Loader2, UserRound } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { GoogleIcon } from '@/components/ui/icons'
import { useAuth } from '@/context/AuthContext'

type Mode = 'signin' | 'signup'

/**
 * Sign-in / Sign-up. Google popup is the primary path (One-Tap requires
 * verified-domain origins and is left as a future enhancement). Guest mode
 * is always one click away — it's a first-class way to use the app.
 */
export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { authAvailable, signInGoogle, signInEmail, signUpEmail, describeError } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<'google' | 'email' | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Passwords need at least 6 characters.')
      return
    }
    setBusy('email')
    try {
      if (mode === 'signin') await signInEmail(email, password)
      else await signUpEmail(email, password)
      onClose()
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(null)
    }
  }

  const google = async () => {
    setError(null)
    setBusy('google')
    try {
      await signInGoogle()
      onClose()
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Welcome to Zydit TTS"
      description="Sign in to keep your preferences across visits — or continue as a guest. Either way, your audio never leaves this device."
    >
      {authAvailable ? (
        <div className="space-y-5">
          <Button variant="outline" size="lg" className="w-full" onClick={() => void google()} disabled={busy !== null}>
            {busy === 'google' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <GoogleIcon className="size-4" />}
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 text-[11px] text-titanium-500">
            <span className="h-px flex-1 bg-white/10" />
            or with email
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-titanium-500" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-[13px] text-zinc-200 placeholder:text-titanium-500/60 focus:border-accent/40 focus:outline-none"
                aria-label="Email address"
              />
            </div>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-titanium-500" aria-hidden />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-[13px] text-zinc-200 placeholder:text-titanium-500/60 focus:border-accent/40 focus:outline-none"
                aria-label="Password"
              />
            </div>

            <motion.div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-300"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin')
                  setError(null)
                }}
                className="text-xs text-titanium-400 transition-colors hover:text-zinc-200"
              >
                {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              </button>
              <Button variant="primary" size="sm" type="submit" disabled={busy !== null}>
                {busy === 'email' && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-titanium-400">
            This deployment isn&apos;t configured with a sign-in service, so
            Zydit is running fully local — which is kind of the point.
          </p>
          <p className="text-xs text-titanium-500">
            Hosts can enable Google and email sign-in by setting the{' '}
            <code className="text-titanium-400">VITE_FIREBASE_*</code> environment
            variables. See <code className="text-titanium-400">docs/FIREBASE_SETUP.md</code> in the repository.
          </p>
        </div>
      )}

      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <Button variant="ghost" className="w-full" onClick={onClose}>
          <Ghost className="size-4" aria-hidden />
          Continue as guest
        </Button>
      </div>
    </Dialog>
  )
}

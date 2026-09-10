import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Ghost, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GoogleIcon } from '@/components/ui/icons'
import { useAuth } from '@/context/AuthContext'

/**
 * Sign-in page. Google is the only account option; guest mode is one tap
 * away and is a first-class way to use the app. When Firebase isn't
 * configured, the page explains that quietly — never an error.
 */
export function SignInPage() {
  const { user, authAvailable, signInGoogle, signOut, describeError } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const google = async () => {
    setError(null)
    setBusy(true)
    try {
      await signInGoogle()
      navigate('/studio')
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[80dvh] items-center justify-center px-6 pb-20 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="glass-strong w-full max-w-md rounded-3xl p-8"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-titanium-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to home
        </Link>

        <h1 className="text-xl font-semibold tracking-tight">Welcome to Zydit TTS</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-titanium-400">
          Sign in to keep your preferences across visits — or continue as a
          guest. Either way, your audio never leaves this device.
        </p>

        <div className="mt-7">
          {user ? (
            <div className="space-y-4">
              <div className="glass flex items-center gap-3 rounded-2xl p-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="size-10 rounded-full" />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {user.displayName ?? 'Signed in'}
                  </p>
                  <p className="truncate text-xs text-titanium-500">{user.email}</p>
                </div>
              </div>
              <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/studio')}>
                Continue to the studio
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          ) : authAvailable ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => void google()}
                disabled={busy}
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <GoogleIcon className="size-4" />
                )}
                Continue with Google
              </Button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs text-red-300"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[13px] leading-relaxed text-titanium-400">
                This deployment isn&apos;t configured with a sign-in service, so
                Zydit is running fully local — which is kind of the point.
              </p>
              <p className="text-xs text-titanium-500">
                Hosts can enable Google sign-in by setting the{' '}
                <code className="text-titanium-400">VITE_FIREBASE_*</code>{' '}
                environment variables. See{' '}
                <code className="text-titanium-400">docs/FIREBASE_SETUP.md</code> in
                the repository.
              </p>
            </div>
          )}
        </div>

        {!user && (
          <div className="mt-6 border-t border-white/[0.06] pt-4">
            <Button variant="ghost" className="w-full" onClick={() => navigate('/studio')}>
              <Ghost className="size-4" aria-hidden />
              Continue as guest
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

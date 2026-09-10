import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ghost, Loader2 } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { GoogleIcon } from '@/components/ui/icons'
import { useAuth } from '@/context/AuthContext'

/**
 * Sign-in. Google is the only account option — one click, no forms.
 * Guest mode is always one tap away and is a first-class way to use the
 * app. When Firebase isn't configured, the dialog explains that quietly
 * instead of showing a broken auth UI.
 */
export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { authAvailable, signInGoogle, describeError } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const google = async () => {
    setError(null)
    setBusy(true)
    try {
      await signInGoogle()
      onClose()
    } catch (err) {
      setError(describeError(err))
    } finally {
      setBusy(false)
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

          <motion.div>
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
          </motion.div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-titanium-400">
            This deployment isn&apos;t configured with a sign-in service, so
            Zydit is running fully local — which is kind of the point.
          </p>
          <p className="text-xs text-titanium-500">
            Hosts can enable Google sign-in by setting the{' '}
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

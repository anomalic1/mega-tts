import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  friendlyAuthError,
  isFirebaseEnabled,
  observeAuth,
  signInWithGooglePopup,
  signOutUser,
} from '@/lib/firebase'
import type { AuthMode, AuthUser } from '@/types'

/**
 * Auth state. Google is the only account provider; guest is a first-class
 * mode — the entire app is functional without an account. When Firebase
 * keys are absent, the modal shows guest-only with a quiet note, never an
 * error.
 */

interface AuthContextValue {
  user: AuthUser | null
  mode: AuthMode
  authAvailable: boolean
  /** True until the first auth-state callback resolves (redirect guard). */
  initializing: boolean
  signInGoogle: () => Promise<void>
  signOut: () => Promise<void>
  /** Returns a friendly message for auth failures (used by the sign-in page). */
  describeError: (err: unknown) => string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    let cancelled = false
    void observeAuth((u) => {
      if (cancelled) return
      setUser(u)
      setInitializing(false)
    }).then((unsub) => {
      if (cancelled) unsub()
      else unsubscribe = unsub
    })
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const signInGoogle = useCallback(async () => {
    await signInWithGooglePopup()
  }, [])

  const signOut = useCallback(async () => {
    await signOutUser()
    setUser(null)
  }, [])

  const describeError = useCallback((err: unknown) => friendlyAuthError(err), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      mode: user ? 'firebase' : 'guest',
      authAvailable: isFirebaseEnabled,
      initializing,
      signInGoogle,
      signOut,
      describeError,
    }),
    [user, initializing, signInGoogle, signOut, describeError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

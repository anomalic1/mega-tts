/**
 * Optional Firebase Auth. Everything here degrades to "guest mode" when the
 * VITE_FIREBASE_* env keys are absent — nothing throws, the app stays usable.
 * Firebase is loaded lazily (dynamic import) so unconfigured builds never
 * pay its bundle cost. Auth is the ONLY Firebase feature used: this app
 * performs zero Firestore/Storage reads or writes, ever.
 */

import type { Auth, User } from 'firebase/auth'
import type { AuthUser } from '@/types'
import {
  COMMITTED_FIREBASE_CONFIG,
  isCommittedConfigComplete,
  type FirebaseWebConfig,
} from '@/data/firebaseConfig'

const env = import.meta.env

/**
 * Config resolution: environment variables win; otherwise the committed
 * config in src/data/firebaseConfig.ts is used, so auth works out of the
 * box once the host fills it in (or pre-enabled before deployment).
 */
const envConfig: FirebaseWebConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID ?? '',
}

const hasEnvConfig = Boolean(
  envConfig.apiKey && envConfig.authDomain && envConfig.projectId && envConfig.appId,
)

export const firebaseConfig: FirebaseWebConfig = hasEnvConfig
  ? envConfig
  : COMMITTED_FIREBASE_CONFIG

export const isFirebaseEnabled =
  hasEnvConfig || isCommittedConfigComplete(COMMITTED_FIREBASE_CONFIG)

/**
 * Diagnostic: which of the required variables are absent from this build.
 * Empty when everything is in place. surfaced on the sign-in page so a
 * misconfigured deployment says exactly what it's missing instead of a
 * generic "not configured".
 */
export const MISSING_FIREBASE_ENV_VARS: readonly string[] = (
  [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ] as const
).filter((name) => !env[name as keyof typeof env])

let authPromise: Promise<Auth | null> | null = null

/** Lazily initialize Firebase Auth. Resolves to null when unconfigured. */
export function getFirebaseAuth(): Promise<Auth | null> {
  if (!isFirebaseEnabled) return Promise.resolve(null)
  if (!authPromise) {
    authPromise = (async () => {
      try {
        const [{ initializeApp, getApps, getApp }, { getAuth }] = await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
        ])
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
        return getAuth(app)
      } catch {
        // Misconfigured keys or blocked network — stay in guest mode silently.
        return null
      }
    })()
  }
  return authPromise
}

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }
}

export async function signInWithGooglePopup(): Promise<AuthUser> {
  const auth = await getFirebaseAuth()
  if (!auth) throw new Error('Sign-in is not available in this build.')
  const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await import('firebase/auth')
  const provider = new GoogleAuthProvider()
  try {
    const cred = await signInWithPopup(auth, provider)
    return toAuthUser(cred.user)
  } catch (err) {
    const code = (err as { code?: string })?.code ?? ''
    // Popups are blocked or unsupported on iOS Safari and in-app browsers
    // (every non-Safari iOS browser is a WebView) — fall back to a
    // full-page redirect instead of showing an error.
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-supported-in-this-environment' ||
      code === 'auth/cancelled-popup-request'
    ) {
      await signInWithRedirect(auth, provider)
      // The page navigates away; when it returns, the auth observer below
      // picks the signed-in user up.
      const redirecting = new Error('Redirecting to Google sign-in…')
      ;(redirecting as Error & { code?: string }).code = 'auth/redirect-in-progress'
      throw redirecting
    }
    throw err
  }
}

/**
 * Consume a pending sign-in redirect on load. The auth observer delivers the
 * user either way — this just clears the redirect state and swallows its
 * errors so a bumpy return never surfaces as a scary message.
 */
export async function consumeRedirectResult(): Promise<void> {
  const auth = await getFirebaseAuth()
  if (!auth) return
  try {
    const { getRedirectResult } = await import('firebase/auth')
    await getRedirectResult(auth)
  } catch {
    /* observer state is the source of truth; stay calm */
  }
}

/** Subscribe to auth state. Returns an unsubscribe fn; callback fires with null guests. */
export async function observeAuth(cb: (user: AuthUser | null) => void): Promise<() => void> {
  const auth = await getFirebaseAuth()
  if (!auth) {
    cb(null)
    return () => {}
  }
  const { onAuthStateChanged } = await import('firebase/auth')
  return onAuthStateChanged(auth, (user) => cb(user ? toAuthUser(user) : null))
}

export async function signOutUser(): Promise<void> {
  const auth = await getFirebaseAuth()
  if (!auth) return
  const { signOut } = await import('firebase/auth')
  await signOut(auth)
}

/** Map Firebase error codes to calm, human-readable hints. */
export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? ''
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'The sign-in window was closed before finishing.'
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup — allow popups and retry.'
    case 'auth/cancelled-popup-request':
      return 'Another sign-in window is already open.'
    case 'auth/network-request-failed':
      return 'Network issue reaching the sign-in service.'
    case 'auth/operation-not-supported-in-this-environment':
      return 'This browser can’t open a sign-in popup — trying a redirect instead.'
    case 'auth/redirect-in-progress':
      return 'Taking you to Google sign-in…'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in — hosts must add it in the Firebase console.'
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}

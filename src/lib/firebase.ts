/**
 * Optional Firebase Auth. Everything here degrades to "guest mode" when the
 * VITE_FIREBASE_* env keys are absent — nothing throws, the app stays usable.
 * Firebase is loaded lazily (dynamic import) so unconfigured builds never
 * pay its bundle cost. Auth is the ONLY Firebase feature used: this app
 * performs zero Firestore/Storage reads or writes, ever.
 */

import type { Auth, User } from 'firebase/auth'
import type { AuthUser } from '@/types'

const env = import.meta.env

export const isFirebaseEnabled = Boolean(
  env.VITE_FIREBASE_API_KEY &&
    env.VITE_FIREBASE_AUTH_DOMAIN &&
    env.VITE_FIREBASE_PROJECT_ID &&
    env.VITE_FIREBASE_APP_ID,
)

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
        const app = getApps().length ? getApp() : initializeApp({
          apiKey: env.VITE_FIREBASE_API_KEY!,
          authDomain: env.VITE_FIREBASE_AUTH_DOMAIN!,
          projectId: env.VITE_FIREBASE_PROJECT_ID!,
          storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: env.VITE_FIREBASE_APP_ID!,
        })
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
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  return toAuthUser(cred.user)
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
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in — hosts must add it in the Firebase console.'
    default:
      return 'Something went wrong signing in. Please try again.'
  }
}

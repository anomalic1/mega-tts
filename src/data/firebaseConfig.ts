/**
 * Firebase web app config — committed so auth works out of the box,
 * with no environment variables needed.
 *
 * These values are PUBLIC by design (they identify your app, they are not
 * secrets — access is controlled by Firebase authorized domains and
 * security rules, not by hiding these). Fill them in from:
 *
 *   Firebase console → Project settings → Your apps → (Web app) →
 *   SDK setup and configuration → Config
 *
 * Environment variables (VITE_FIREBASE_*) override these when set, so a
 * fork can point at a different Firebase project without editing code.
 */

export interface FirebaseWebConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId: string
}

export const COMMITTED_FIREBASE_CONFIG: FirebaseWebConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

/** True when the committed config has the four required values filled in. */
export function isCommittedConfigComplete(config: FirebaseWebConfig): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId)
}

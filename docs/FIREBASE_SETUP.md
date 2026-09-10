# Firebase Auth Setup Guide

Zydit TTS uses Firebase **Authentication only**, with **Google as the single
sign-in provider** — one click, no forms, no passwords. The app performs zero
Firestore reads/writes and zero Cloud Storage access — your audio and history
never touch Firebase. Auth exists purely as optional convenience; the studio
can also be gated behind it (`src/config.ts` → `REQUIRE_SIGN_IN`).

There are **two ways to configure Firebase** — pick one:

1. **Committed config (pre-enabled, simplest):** fill in the values in
   `src/data/firebaseConfig.ts` and commit. Firebase web config values are
   public identifiers, not secrets — this is safe and is how Firebase's own
   docs recommend using them. Access is controlled by authorized domains
   (step 5) and security rules (step 6), not by hiding these values.
2. **Environment variables:** set `VITE_FIREBASE_*` in Cloudflare Pages →
   Settings → Environment variables (Production + Preview), then redeploy.
   These override the committed config, so forks can point at their own
   Firebase project without editing code.

If you skip this guide entirely, the app runs fine — it will simply show a
"running fully local" note in the sign-in dialog.

---

## 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com/)
2. **Add project** → name it (e.g. `zydit-tts`) → continue
3. Analytics is not needed; disable it if you prefer

## 2. Register a Web app

1. In the project overview, click the **Web (`</>`)** icon
2. Nickname: `zydit-tts-web` → **Register app**
3. Copy the `firebaseConfig` values from the snippet shown
4. Either paste them into `src/data/firebaseConfig.ts` (committed config),
   or map them to the environment variables below

## 3. Map the config to environment variables

| Firebase config key | Environment variable |
|---|---|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` (optional) |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` (optional) |
| `appId` | `VITE_FIREBASE_APP_ID` |

Auth is enabled only when **API key, auth domain, project ID, and app ID**
are all present. Anything missing → silent guest mode, no errors.

**Set them in Cloudflare Pages:** Project → **Settings → Environment
variables** → add each variable for **both Production and Preview**, then
redeploy.

## 4. Enable the Google sign-in provider

In the Firebase console: **Build → Authentication → Get started → Sign-in method**

1. Enable **Google**
2. Pick a project support email
3. Save — Firebase auto-provisions the OAuth 2.0 client ID

That's the only provider the frontend uses. The app signs in with
`signInWithPopup`, which works out of the box once Google is enabled and your
domain is authorized (step 5).

> **Note on One-Tap:** Google One-Tap requires registering exact authorized
> origins in the Google Cloud console and behaves inconsistently across
> browsers; this app ships popup sign-in as the reliable default. One-Tap is
> a future enhancement.

## 5. Authorize your domains

**Authentication → Settings → Authorized domains** — add:

- `zydit.in` (production domain)
- `<your-project>.pages.dev` (Cloudflare Pages preview/default domain)
- `localhost` (already present by default, for local development)

Without these, Google sign-in will fail with `auth/unauthorized-domain` on
the deployed site.

## 6. Security rules — locked down by default

This app never touches Firestore or Storage, so **no rules are needed for it
to run**. But if you (or a fork) later add Firestore or Storage, start from
deny-all and open only what a feature deliberately requires:

**Firestore (`firestore.rules`):**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny everything by default. Zydit TTS needs no Firestore access.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Storage (`storage.rules`):**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Deny everything by default. Zydit TTS needs no Storage access.
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

If you later add user-scoped data (e.g. synced preferences), the correct
shape is per-user documents that only their owner can read/write:

```
match /users/{uid}/prefs/{doc} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

**Never** open rules to `allow read, write: if true` on a project attached to
a public web app.

## 7. Verify

1. Redeploy with the `VITE_FIREBASE_*` variables set
2. Open the site → **Sign in**
3. You should see a single "Continue with Google" button (plus guest mode)
4. Google sign-in should open a popup and return you signed in
5. With variables removed, the same dialog shows the "running fully local"
   guest note — confirming graceful degradation works

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { resolveSpeechEndpoint } from '@/lib/utils'

/**
 * API settings. The base URL and custom voices persist in localStorage
 * (they're not secrets); the Bearer key lives ONLY in sessionStorage so it
 * is wiped when the tab closes. An empty base URL falls back to the
 * server-provided default (VITE_TTS_API_BASE_URL), and if that is missing
 * too, the app stays calm: generation simply asks for an endpoint.
 */

const BASE_URL_KEY = 'zydit.baseUrl'
const API_KEY_KEY = 'zydit.apiKey'
const CUSTOM_VOICES_KEY = 'zydit.customVoices'

export interface CustomVoice {
  id: string
  name: string
}

interface SettingsContextValue {
  /** User-entered override, '' when falling back to the env default. */
  baseUrl: string
  setBaseUrl: (url: string) => void
  /** The server default from env, '' when unset. */
  envBaseUrl: string
  /** Full resolved endpoint (user override → env → ''). */
  resolvedEndpoint: string
  isEndpointConfigured: boolean

  apiKey: string
  setApiKey: (key: string) => void

  customVoices: CustomVoice[]
  addCustomVoice: (voice: CustomVoice) => void
  removeCustomVoice: (id: string) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function readLocal(key: string): string {
  try {
    return localStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

function readSession(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? ''
  } catch {
    return ''
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [baseUrl, setBaseUrlState] = useState(() => readLocal(BASE_URL_KEY))
  const [apiKey, setApiKeyState] = useState(() => readSession(API_KEY_KEY))
  const [customVoices, setCustomVoices] = useState<CustomVoice[]>(() => {
    try {
      return JSON.parse(readLocal(CUSTOM_VOICES_KEY) || '[]') as CustomVoice[]
    } catch {
      return []
    }
  })

  const envBaseUrl = import.meta.env.VITE_TTS_API_BASE_URL ?? ''

  const setBaseUrl = useCallback((url: string) => {
    setBaseUrlState(url)
    try {
      if (url) localStorage.setItem(BASE_URL_KEY, url)
      else localStorage.removeItem(BASE_URL_KEY)
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, [])

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key)
    try {
      if (key) sessionStorage.setItem(API_KEY_KEY, key)
      else sessionStorage.removeItem(API_KEY_KEY)
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, [])

  const addCustomVoice = useCallback((voice: CustomVoice) => {
    setCustomVoices((prev) => {
      if (prev.some((v) => v.id === voice.id || v.name === voice.name)) return prev
      const next = [...prev, voice]
      try {
        localStorage.setItem(CUSTOM_VOICES_KEY, JSON.stringify(next))
      } catch { /* in-memory only */ }
      return next
    })
  }, [])

  const removeCustomVoice = useCallback((id: string) => {
    setCustomVoices((prev) => {
      const next = prev.filter((v) => v.id !== id)
      try {
        localStorage.setItem(CUSTOM_VOICES_KEY, JSON.stringify(next))
      } catch { /* in-memory only */ }
      return next
    })
  }, [])

  // Sync the key across tabs is intentionally NOT done — the key is session-scoped.

  const resolvedEndpoint = useMemo(
    () => resolveSpeechEndpoint(baseUrl || envBaseUrl),
    [baseUrl, envBaseUrl],
  )

  const value = useMemo<SettingsContextValue>(
    () => ({
      baseUrl,
      setBaseUrl,
      envBaseUrl,
      resolvedEndpoint,
      isEndpointConfigured: resolvedEndpoint !== '',
      apiKey,
      setApiKey,
      customVoices,
      addCustomVoice,
      removeCustomVoice,
    }),
    [
      baseUrl,
      setBaseUrl,
      envBaseUrl,
      resolvedEndpoint,
      apiKey,
      setApiKey,
      customVoices,
      addCustomVoice,
      removeCustomVoice,
    ],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

/** Convenience: is the user relying on the server-configured default endpoint? */
export function useIsUsingEnvDefault(): boolean {
  const { baseUrl, envBaseUrl } = useSettings()
  return !baseUrl && envBaseUrl !== ''
}

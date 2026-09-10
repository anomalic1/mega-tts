import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ApiSettingsDialog } from '@/components/ApiSettingsDialog'

/**
 * Cross-page UI affordances. Currently: the API Settings dialog, which can
 * be opened from anywhere (navbar gear, studio hints, endpoint prompts).
 */

interface UiContextValue {
  openSettings: () => void
}

const UiContext = createContext<UiContextValue | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const openSettings = useCallback(() => setSettingsOpen(true), [])

  const value = useMemo(() => ({ openSettings }), [openSettings])

  return (
    <UiContext.Provider value={value}>
      {children}
      <ApiSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </UiContext.Provider>
  )
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used within UiProvider')
  return ctx
}

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Studio } from '@/components/Studio'
import { HistoryPanel } from '@/components/HistoryPanel'
import { AboutSection } from '@/components/AboutSection'
import { Footer } from '@/components/Footer'
import { AuthModal } from '@/components/AuthModal'
import { ApiSettingsDialog } from '@/components/ApiSettingsDialog'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import { PlayerProvider } from '@/context/PlayerContext'
import { ToastProvider } from '@/context/ToastContext'
import type { HistoryEntry } from '@/types'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [restore, setRestore] = useState<HistoryEntry | null>(null)

  const openSettings = () => setSettingsOpen(true)

  return (
    <SettingsProvider>
      <AuthProvider>
        <PlayerProvider>
          <ToastProvider>
            <div id="top" className="min-h-dvh">
              <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenSettings={openSettings} />

              <main>
                <Hero />
                <Studio
                  onOpenSettings={openSettings}
                  restore={restore}
                  onRestoreConsumed={() => setRestore(null)}
                />
                <HistoryPanel
                  onRestore={(entry) => {
                    setRestore(entry)
                    document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                />
                <AboutSection />
              </main>

              <Footer />

              <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
              <ApiSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
          </ToastProvider>
        </PlayerProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}

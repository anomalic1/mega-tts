import { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Landing } from '@/pages/Landing'
import { StudioPage } from '@/pages/StudioPage'
import { SignInPage } from '@/pages/SignInPage'
import { AboutPage } from '@/pages/AboutPage'
import { NotFound } from '@/pages/NotFound'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider } from '@/context/AuthContext'
import { PlayerProvider } from '@/context/PlayerContext'
import { ToastProvider } from '@/context/ToastContext'
import { UiProvider } from '@/context/UiContext'

/** Reset scroll position on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function Layout() {
  return (
    <div id="top" className="min-h-dvh">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <PlayerProvider>
          <ToastProvider>
            <UiProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Landing />} />
                    <Route path="studio" element={<StudioPage />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </UiProvider>
          </ToastProvider>
        </PlayerProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}

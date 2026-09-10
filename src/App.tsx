import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Landing } from '@/pages/Landing'
import { StudioPage } from '@/pages/StudioPage'
import { SignInPage } from '@/pages/SignInPage'
import { AboutPage } from '@/pages/AboutPage'
import { NotFound } from '@/pages/NotFound'
import { SettingsProvider } from '@/context/SettingsContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { PlayerProvider } from '@/context/PlayerContext'
import { ToastProvider } from '@/context/ToastContext'
import { UiProvider } from '@/context/UiContext'
import { REQUIRE_SIGN_IN } from '@/config'

/** Reset scroll position on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

/**
 * Gate the studio behind sign-in when REQUIRE_SIGN_IN is on. Waits for the
 * initial auth-state resolution so a returning signed-in user is never
 * bounced to /signin by a race.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth()

  if (REQUIRE_SIGN_IN && initializing) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center pt-20">
        <Loader2 className="size-5 animate-spin text-titanium-500" aria-label="Checking your session" />
      </div>
    )
  }
  if (REQUIRE_SIGN_IN && !user) {
    return <Navigate to="/signin" replace />
  }
  return <>{children}</>
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
                    <Route
                      path="studio"
                      element={
                        <RequireAuth>
                          <StudioPage />
                        </RequireAuth>
                      }
                    />
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

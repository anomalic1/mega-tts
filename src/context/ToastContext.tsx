import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springPill } from '@/lib/motion'

/**
 * Minimal toast system — the only place errors are ever surfaced. Calm,
 * transient, never a page-blocking banner.
 */

type ToastVariant = 'info' | 'success' | 'error'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof Info; ring: string }> = {
  info: { icon: Info, ring: 'text-titanium-400' },
  success: { icon: CheckCircle2, ring: 'text-accent' },
  error: { icon: AlertCircle, ring: 'text-red-400' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = nextId.current++
      setToasts((prev) => [...prev.slice(-3), { id, message, variant }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const { icon: Icon, ring } = VARIANT_STYLES[t.variant]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={springPill}
                className="glass-strong pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3"
              >
                <Icon className={cn('size-4 shrink-0', ring)} aria-hidden />
                <p className="text-sm text-zinc-200">{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="ml-2 text-xs text-titanium-500 transition-colors hover:text-zinc-200"
                  aria-label="Dismiss notification"
                >
                  Dismiss
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

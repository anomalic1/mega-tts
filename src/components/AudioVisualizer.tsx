import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Canvas waveform. Two modes in one component:
 *  — Live: AnalyserNode frequency bars, mirrored center-out (while playing).
 *  — Static: decoded peak array with the played portion lit in accent
 *    (while paused, or when the user prefers reduced motion).
 */

const BAR_COUNT = 64
const ACCENT = 'rgba(61, 139, 255, 0.9)'
const DIM = 'rgba(255, 255, 255, 0.14)'
const PEAK_DIM = 'rgba(255, 255, 255, 0.22)'

export function AudioVisualizer({
  analyser,
  isPlaying,
  peaks,
  progress,
  className,
}: {
  analyser: AnalyserNode | null
  isPlaying: boolean
  /** Static decoded peaks (0–1) for the paused/seekable overview. */
  peaks?: Float32Array | null
  /** 0–1 playback progress for the static rendering. */
  progress?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      if (width === 0 || height === 0) return
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const drawLive = () => {
      const { width, height } = canvas
      const data = new Uint8Array(analyser!.frequencyBinCount)
      analyser!.getByteFrequencyData(data)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mid = height / 2
      const slot = width / BAR_COUNT
      const barW = Math.max(2, slot * 0.55)

      for (let i = 0; i < BAR_COUNT; i++) {
        // Log-ish sampling across the spectrum so it reads balanced, not bass-heavy.
        const idx = Math.floor(Math.pow(i / BAR_COUNT, 1.6) * data.length * 0.7)
        const v = data[idx] / 255
        const barH = Math.max(2, v * (height * 0.85))
        const x = i * slot + (slot - barW) / 2
        ctx.fillStyle = i === Math.floor(BAR_COUNT * 0.5) ? ACCENT : DIM
        // Mirrored center-out bars.
        ctx.beginPath()
        ctx.roundRect(x, mid - barH / 2, barW, barH, barW / 2)
        ctx.fill()
      }
    }

    const drawStatic = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (!peaks || peaks.length === 0) return
      const mid = height / 2
      const slot = width / peaks.length
      const barW = Math.max(2, slot * 0.55)
      const playedX = (progress ?? 0) * width

      for (let i = 0; i < peaks.length; i++) {
        const barH = Math.max(2, peaks[i] * (height * 0.8))
        const x = i * slot + (slot - barW) / 2
        ctx.fillStyle = x + barW / 2 <= playedX ? ACCENT : PEAK_DIM
        ctx.beginPath()
        ctx.roundRect(x, mid - barH / 2, barW, barH, barW / 2)
        ctx.fill()
      }
    }

    const tick = () => {
      if (isPlaying && analyser && !reducedMotion) {
        drawLive()
      } else {
        drawStatic()
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [analyser, isPlaying, peaks, progress])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-16 w-full', className)}
      role="img"
      aria-label={isPlaying ? 'Live audio waveform' : 'Audio waveform overview'}
    />
  )
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { connectAnalyser, getAudioContext } from '@/lib/audio'
import { pitchFactor } from '@/lib/utils'
import type { GenerationParams } from '@/types'

/**
 * The shared player. One <audio> element for the whole app, routed through
 * one AnalyserNode so the visualizer, scrubber, and transport controls all
 * bind to a single audio graph. Speed and pitch are playback-time controls:
 * speed is also sent to the API, but pitch is applied locally via
 * playbackRate (preservesPitch off) and is NOT baked into the mp3.
 */

/** Zero-byte silent WAV — used solely to unlock the element on iOS. */
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

export interface TrackMeta {
  voiceName: string
  params: GenerationParams
  /** History entry this track came from, if any. */
  entryId?: number
}

interface PlayerContextValue {
  load: (blob: Blob, meta: TrackMeta) => void
  close: () => void
  togglePlay: () => void
  seek: (time: number) => void
  /**
   * Unlock audio playback on iOS, synchronously inside a user gesture.
   * Call BEFORE any await (fetch, decode…) — iOS lets an <audio> element
   * play later without another gesture only if it was unlocked in one.
   */
  unlock: () => void

  hasTrack: boolean
  isPlaying: boolean
  currentTime: number
  duration: number

  speed: number
  setSpeed: (s: number) => void
  pitch: number
  setPitch: (p: number) => void
  volume: number
  setVolume: (v: number) => void
  loop: boolean
  toggleLoop: () => void

  track: { blob: Blob; meta: TrackMeta } | null
  analyser: AnalyserNode | null
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const unlockedRef = useRef(false)

  const [track, setTrack] = useState<{ blob: Blob; meta: TrackMeta } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeedState] = useState(1)
  const [pitch, setPitchState] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [loop, setLoop] = useState(false)

  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio()
    audioRef.current.preload = 'auto'
  }

  const applyRate = useCallback((el: HTMLAudioElement, spd: number, ptch: number) => {
    // With preservesPitch off, playbackRate shifts pitch as well as tempo —
    // that's exactly what we want when the user asks for a pitch change.
    el.preservesPitch = ptch === 0
    el.playbackRate = spd * pitchFactor(ptch)
  }, [])

  /**
   * iOS Safari only allows play() on an element that has already played
   * successfully inside a user gesture. Play a zero-byte silent WAV right
   * here — synchronously in the tap — and every later load()/play() on the
   * same element is allowed, even after an await. Also resumes the shared
   * AudioContext while we still hold the gesture.
   */
  const unlock = useCallback(() => {
    const el = audioRef.current
    if (!el || unlockedRef.current) return
    getAudioContext()
    el.src = SILENT_WAV
    el.play()
      .then(() => {
        unlockedRef.current = true
        el.pause()
      })
      .catch(() => {
        /* not unlocked — the next tap tries again */
      })
  }, [])

  const load = useCallback(
    (blob: Blob, meta: TrackMeta) => {
      const el = audioRef.current
      if (!el) return

      // Unlock audio inside this (gesture-adjacent) call so playback is allowed.
      getAudioContext()

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = URL.createObjectURL(blob)
      el.src = objectUrlRef.current
      el.loop = loop
      el.volume = volume
      applyRate(el, speed, pitch)

      const { analyser } = connectAnalyser(el)
      analyserRef.current = analyser

      setTrack({ blob, meta })
      setCurrentTime(0)
      setDuration(0)

      void el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    },
    [applyRate, loop, pitch, speed, volume],
  )

  const close = useCallback(() => {
    const el = audioRef.current
    if (el) {
      el.pause()
      el.removeAttribute('src')
      el.load()
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const togglePlay = useCallback(() => {
    const el = audioRef.current
    if (!el || !track) return
    getAudioContext()
    if (el.paused) {
      void el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      el.pause()
      setIsPlaying(false)
    }
  }, [track])

  const seek = useCallback((time: number) => {
    const el = audioRef.current
    if (!el) return
    el.currentTime = time
    setCurrentTime(time)
  }, [])

  const setSpeed = useCallback(
    (s: number) => {
      setSpeedState(s)
      const el = audioRef.current
      if (el) applyRate(el, s, pitch)
    },
    [applyRate, pitch],
  )

  const setPitch = useCallback(
    (p: number) => {
      setPitchState(p)
      const el = audioRef.current
      if (el) applyRate(el, speed, p)
    },
    [applyRate, speed],
  )

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    const el = audioRef.current
    if (el) el.volume = v
  }, [])

  const toggleLoop = useCallback(() => {
    setLoop((prev) => {
      const next = !prev
      const el = audioRef.current
      if (el) el.loop = next
      return next
    })
  }, [])

  // Wire element events once.
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => setDuration(el.duration || 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('durationchange', onMeta)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onPause)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('durationchange', onMeta)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onPause)
    }
  }, [])

  // Revoke the URL on unmount.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      audioRef.current?.pause()
    }
  }, [])

  const value = useMemo<PlayerContextValue>(
    () => ({
      load,
      close,
      togglePlay,
      seek,
      unlock,
      hasTrack: track !== null,
      isPlaying,
      currentTime,
      duration,
      speed,
      setSpeed,
      pitch,
      setPitch,
      volume,
      setVolume,
      loop,
      toggleLoop,
      track,
      analyser: analyserRef.current,
    }),
    [
      load,
      close,
      togglePlay,
      seek,
      unlock,
      track,
      isPlaying,
      currentTime,
      duration,
      speed,
      setSpeed,
      pitch,
      setPitch,
      volume,
      setVolume,
      loop,
      toggleLoop,
    ],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

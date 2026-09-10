/**
 * Web Audio plumbing — one lazily created AudioContext shared by the whole app.
 * Browsers require creation/resume inside a user gesture; every entry point
 * here is called from a click handler, so we're safe.
 */

let ctx: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
  return ctx
}

const connected = new WeakMap<HTMLMediaElement, { analyser: AnalyserNode; disconnect: () => void }>()

/**
 * Route an <audio> element through an AnalyserNode (for the visualizer)
 * and on to the speakers. An element may only ever be connected once —
 * MediaElementAudioSourceNode is one-shot — so connections are memoized.
 */
export function connectAnalyser(el: HTMLMediaElement): {
  analyser: AnalyserNode
  disconnect: () => void
} {
  const existing = connected.get(el)
  if (existing) return existing

  const audioCtx = getAudioContext()
  const source = audioCtx.createMediaElementSource(el)
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 2048
  analyser.smoothingTimeConstant = 0.8
  source.connect(analyser)
  analyser.connect(audioCtx.destination)

  const record = {
    analyser,
    disconnect: () => {
      try {
        source.disconnect()
        analyser.disconnect()
      } catch {
        /* already torn down */
      }
    },
  }
  connected.set(el, record)
  return record
}

/**
 * Decode a Blob into a downsampled peak array — the static waveform a
 * scrubber can draw before/without pressing play.
 */
export async function decodePeaks(blob: Blob, buckets = 160): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer()
  const audioCtx = getAudioContext()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0))
  const channel = audioBuffer.getChannelData(0)
  const peaks = new Float32Array(buckets)
  const size = Math.floor(channel.length / buckets) || 1
  for (let i = 0; i < buckets; i++) {
    let peak = 0
    const start = i * size
    for (let j = 0; j < size; j += 16) {
      // Sparse sampling of the bucket keeps the decode cheap.
      const v = Math.abs(channel[start + j] ?? 0)
      if (v > peak) peak = v
    }
    peaks[i] = peak
  }
  return peaks
}

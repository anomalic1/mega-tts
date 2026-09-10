import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { History, Loader2, Play, Trash2, Trash } from 'lucide-react'
import { useHistoryEntries } from '@/hooks/useHistory'
import { usePlayer } from '@/context/PlayerContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { deleteEntry, estimateUsage, purgeAll } from '@/lib/db'
import { cn, formatBytes } from '@/lib/utils'
import { springModal } from '@/lib/motion'
import type { HistoryEntry } from '@/types'

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Local history — a live view of IndexedDB. Everything shown here lives on
 * this device only. "Purge Local Storage" removes all of it, irreversibly.
 */
export function HistoryPanel({
  onRestore,
}: {
  onRestore: (entry: HistoryEntry) => void
}) {
  const entries = useHistoryEntries()
  const player = usePlayer()
  const { toast } = useToast()
  const [confirmPurge, setConfirmPurge] = useState(false)
  const [usage, setUsage] = useState<{ usage: number; quota: number } | null>(null)

  useEffect(() => {
    void estimateUsage().then(setUsage)
  }, [entries])

  const play = (entry: HistoryEntry) => {
    player.load(entry.blob, {
      voiceName: entry.voiceName,
      params: entry.params,
      entryId: entry.id,
    })
  }

  const purge = async () => {
    player.close()
    await purgeAll()
    setConfirmPurge(false)
    toast('Local storage purged. Every trace of your audio is gone.', 'success')
  }

  return (
    <section id="history" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <History className="size-5 text-titanium-400" aria-hidden />
            Local history
          </h2>
          <p className="mt-1 text-[13px] text-titanium-500">
            Stored in this browser&apos;s IndexedDB — never uploaded, never synced.
            {usage && ` Using ${formatBytes(usage.usage)} on this device.`}
          </p>
        </div>
        {entries && entries.length > 0 && (
          <Button variant="danger" size="sm" onClick={() => setConfirmPurge(true)}>
            <Trash className="size-3.5" aria-hidden />
            Purge Local Storage
          </Button>
        )}
      </div>

      {entries === undefined ? (
        <div className="glass flex h-32 items-center justify-center rounded-2xl text-titanium-500">
          <Loader2 className="size-4 animate-spin" aria-hidden />
        </div>
      ) : entries.length === 0 ? (
        <div className="glass flex h-32 flex-col items-center justify-center gap-2 rounded-2xl text-center">
          <p className="text-[13px] text-titanium-400">Nothing here yet.</p>
          <p className="text-xs text-titanium-500">
            Generate something in the studio — it will land here, on your device only.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {entries.map((entry) => {
              const isActive = player.track?.meta.entryId === entry.id
              return (
                <motion.li
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={springModal}
                  className={cn(
                    'glass group flex items-center gap-4 rounded-2xl px-4 py-3',
                    isActive && 'border-accent/40',
                  )}
                >
                  <button
                    onClick={() => play(entry)}
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                      isActive && player.isPlaying
                        ? 'bg-accent text-white'
                        : 'border border-white/10 text-titanium-300 hover:border-accent/40 hover:text-accent',
                    )}
                    aria-label={`Play: ${entry.params.text.slice(0, 40)}`}
                  >
                    <Play className="ml-0.5 size-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-zinc-200">{entry.params.text}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-titanium-500">
                      <span className="font-medium text-titanium-400">{entry.voiceName}</span>
                      <span>·</span>
                      <span>{formatDate(entry.createdAt)}</span>
                      <span>·</span>
                      <span>{formatBytes(entry.sizeBytes)}</span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button variant="ghost" size="sm" onClick={() => onRestore(entry)}>
                      Restore
                    </Button>
                    <button
                      onClick={async () => {
                        if (isActive) player.close()
                        if (entry.id != null) await deleteEntry(entry.id)
                      }}
                      className="flex size-8 items-center justify-center rounded-lg text-titanium-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      aria-label="Delete this entry"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}

      <Dialog
        open={confirmPurge}
        onClose={() => setConfirmPurge(false)}
        title="Purge all local audio?"
        description="Every generated clip and its metadata will be permanently deleted from this browser. This cannot be undone."
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmPurge(false)}>
            Keep it
          </Button>
          <Button variant="danger" onClick={() => void purge()}>
            <Trash2 className="size-3.5" aria-hidden />
            Purge everything
          </Button>
        </div>
      </Dialog>
    </section>
  )
}

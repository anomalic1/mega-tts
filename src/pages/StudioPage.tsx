import { useState } from 'react'
import { Studio } from '@/components/Studio'
import { HistoryPanel } from '@/components/HistoryPanel'
import type { HistoryEntry } from '@/types'

/** The working surface: generation studio plus local history. */
export function StudioPage() {
  const [restore, setRestore] = useState<HistoryEntry | null>(null)

  return (
    <div className="pt-20">
      <Studio restore={restore} onRestoreConsumed={() => setRestore(null)} />
      <HistoryPanel onRestore={setRestore} />
    </div>
  )
}

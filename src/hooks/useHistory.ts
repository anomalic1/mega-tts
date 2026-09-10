import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { HistoryEntry } from '@/types'

/** Reactive, newest-first history straight from IndexedDB. */
export function useHistoryEntries(): HistoryEntry[] | undefined {
  return useLiveQuery(() => db.history.orderBy('createdAt').reverse().toArray(), [])
}

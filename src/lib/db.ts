import Dexie, { type Table } from 'dexie'
import type { HistoryEntry } from '@/types'

/**
 * Local-only audio history. Blobs live in IndexedDB (this browser, this device) —
 * never uploaded, never synced. "Purge Local Storage" wipes it completely.
 */

const MAX_ENTRIES = 100

class ZyditDB extends Dexie {
  history!: Table<HistoryEntry, number>

  constructor() {
    super('zydit-tts')
    this.version(1).stores({
      history: '++id, createdAt, voiceId, model',
    })
  }
}

export const db = new ZyditDB()

export async function putEntry(entry: HistoryEntry): Promise<number> {
  const id = await db.history.add(entry)
  // LRU eviction — keep history bounded so storage pressure never surprises the user.
  const count = await db.history.count()
  if (count > MAX_ENTRIES) {
    const oldest = await db.history.orderBy('createdAt').limit(count - MAX_ENTRIES).toArray()
    await db.history.bulkDelete(oldest.map((e) => e.id!).filter(Boolean))
  }
  return id
}

export function deleteEntry(id: number) {
  return db.history.delete(id)
}

/** Wipe every stored audio blob and its metadata. Irreversible by design. */
export async function purgeAll() {
  await db.history.clear()
}

/** Best-effort storage usage report for the privacy panel. */
export async function estimateUsage(): Promise<{ usage: number; quota: number } | null> {
  try {
    const est = await navigator.storage.estimate()
    if (est.usage == null) return null
    return { usage: est.usage, quota: est.quota ?? 0 }
  } catch {
    return null
  }
}

/** Ask the browser to keep our audio history around under storage pressure. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist()
  } catch {
    /* not supported — history still works, just not persistent */
  }
  return false
}

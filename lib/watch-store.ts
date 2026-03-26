/**
 * In-memory watch store.
 * In production, replace with Vercel KV, Upstash Redis, or Firestore.
 * For now this works for demo/MVP — data persists per serverless instance.
 */

export interface WatchEntry {
  id: string;
  companyId: number;
  webhookUrl: string;
  lastStatus: string;
  lastChecked: string;
  createdAt: string;
  customerId: string;
}

// In production: use Vercel KV or Firestore
const watches = new Map<string, WatchEntry>();

export function addWatch(companyId: number, webhookUrl: string, customerId: string): WatchEntry {
  const id = `watch_${companyId}_${Date.now()}`;
  const entry: WatchEntry = {
    id,
    companyId,
    webhookUrl,
    lastStatus: '',
    lastChecked: '',
    createdAt: new Date().toISOString(),
    customerId,
  };
  watches.set(id, entry);
  return entry;
}

export function removeWatch(id: string): boolean {
  return watches.delete(id);
}

export function getWatches(customerId?: string): WatchEntry[] {
  const all = Array.from(watches.values());
  if (customerId) return all.filter((w) => w.customerId === customerId);
  return all;
}

export function getAllWatches(): WatchEntry[] {
  return Array.from(watches.values());
}

export function updateWatchStatus(id: string, status: string): void {
  const entry = watches.get(id);
  if (entry) {
    entry.lastStatus = status;
    entry.lastChecked = new Date().toISOString();
  }
}

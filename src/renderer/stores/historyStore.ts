import { create } from 'zustand'

export interface HistoryItem {
  id: string
  timestamp: number
  to: string
  cc?: string
  bcc?: string
  subject: string
  body: string
  prompt: string
  tone: string
}

interface HistoryState {
  history: HistoryItem[]
  addHistoryItem: (item: HistoryItem) => void
  deleteHistoryItem: (id: string) => void
  clearHistory: () => void
  loadHistory: () => Promise<void>
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  addHistoryItem: (item) => {
    const newHistory = [item, ...get().history]
    set({ history: newHistory })
    window.electron.store.set('history', newHistory)
  },
  deleteHistoryItem: (id) => {
    const newHistory = get().history.filter(item => item.id !== id)
    set({ history: newHistory })
    window.electron.store.set('history', newHistory)
  },
  clearHistory: () => {
    set({ history: [] })
    window.electron.store.set('history', [])
  },
  loadHistory: async () => {
    const history = (await window.electron.store.get('history') as HistoryItem[]) || []
    set({ history })
  }
}))

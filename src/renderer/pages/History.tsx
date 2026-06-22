import { useHistoryStore } from '../stores/historyStore'
import { useEffect, useState } from 'react'
import type { HistoryItem } from '../stores/historyStore'
import { ArrowLeft, Trash2, Clock } from 'lucide-react'

export function History() {
  const { history, loadHistory, deleteHistoryItem } = useHistoryStore()
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  if (selectedItem) {
    return (
      <div className="p-6 max-w-[1100px] mx-auto space-y-4 pb-20 bg-surface text-text select-text">
        <button
          onClick={() => setSelectedItem(null)}
          className="flex items-center space-x-1.5 text-xs text-text-muted hover:text-text transition-colors font-mono uppercase tracking-wider select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </button>

        <div className="bg-surface-hover p-6 rounded-xl border border-border/80 space-y-5 shadow-xs">
          <div className="border-b border-border/60 pb-4 space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{selectedItem.subject}</h2>
            <div className="text-xs text-text-muted flex flex-wrap justify-between items-center gap-4 pt-2 font-mono">
              <div className="space-y-1">
                <p>To: <span className="text-text font-sans">{selectedItem.to}</span></p>
                {selectedItem.cc && <p>CC: <span className="text-text font-sans">{selectedItem.cc}</span></p>}
                {selectedItem.bcc && <p>BCC: <span className="text-text font-sans">{selectedItem.bcc}</span></p>}
              </div>
              <div className="text-right space-y-1">
                <p>{new Date(selectedItem.timestamp).toLocaleString()}</p>
                <p>Tone: <span className="text-text">{selectedItem.tone}</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-text-muted select-none">Original prompt instructions</h3>
              <div className="bg-surface p-4 rounded-lg border border-border/80 text-xs text-text-muted min-h-[350px] max-h-[450px] overflow-auto whitespace-pre-wrap leading-relaxed">
                {selectedItem.prompt}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-text-muted select-none">Sent email content</h3>
              <div
                className="bg-surface p-4 rounded-lg border border-border/80 prose prose-sm dark:prose-invert max-w-none min-h-[350px] max-h-[450px] overflow-auto text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedItem.body }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-4 pb-20 bg-surface text-text select-none">
      <div className="pb-3 border-b border-border/80">
        <h2 className="text-xs font-bold tracking-tight uppercase font-mono text-text">Sent History</h2>
      </div>

      {history.length === 0 ? (
        <div className="bg-surface-hover/50 p-16 rounded-xl border border-border/50 text-center flex flex-col items-center justify-center space-y-4 shadow-inner">
          <Clock className="w-8 h-8 text-text-muted/40" />
          <p className="text-xs text-text-muted font-medium">No records found. Generated messages will appear here.</p>
        </div>
      ) : (
        <div className="border border-border/80 rounded-lg overflow-hidden bg-surface-hover divide-y divide-border/50 shadow-xs">
          {history.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-sidebar/80 cursor-pointer transition-colors duration-150 active:scale-[0.995] text-xs"
            >
              <div className="flex items-center space-x-6 flex-1 min-w-0">
                <span className="font-mono text-text-muted w-44 truncate">To: {item.to}</span>
                <span className="font-medium text-text truncate">{item.subject || '(No Subject)'}</span>
              </div>
              <div className="flex items-center space-x-4 ml-4 shrink-0 font-mono text-[10px] text-text-muted">
                <span className="px-2 py-0.5 rounded border border-border bg-surface uppercase tracking-wider text-[9px] font-semibold hidden sm:inline-block">{item.tone}</span>
                <span className="w-24 text-right hidden sm:inline-block">{new Date(item.timestamp).toLocaleDateString()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirmId(item.id)
                  }}
                  className="p-1.5 text-text-muted hover:text-red-500 hover:bg-surface rounded-md transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border/80 rounded-xl shadow-lg w-full max-w-sm overflow-hidden select-none">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold tracking-tight text-text">Delete Record</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Are you sure you want to permanently delete this record from your history? This action cannot be undone.
              </p>
            </div>
            <div className="bg-sidebar/50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-border/60">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHistoryItem(deleteConfirmId)
                  setDeleteConfirmId(null)
                }}
                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-md text-xs font-semibold transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

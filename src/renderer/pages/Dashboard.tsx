import { Link } from 'react-router-dom'
import { Edit, Settings, CheckCircle2, AlertCircle } from 'lucide-react'
import { useSettingsStore } from '../stores/settingsStore'
import { useHistoryStore } from '../stores/historyStore'
import { useEffect } from 'react'

export function Dashboard() {
  const { geminiApiKey, googleClientId, googleClientSecret } = useSettingsStore()
  const { history, loadHistory } = useHistoryStore()

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const hasApiKey = !!geminiApiKey
  const hasOauth = !!googleClientId && !!googleClientSecret

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col justify-center min-h-[85vh] space-y-8 select-none bg-surface text-text">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Active Environment
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          Mail Genie
        </h1>
        <p className="text-sm text-text-muted max-w-xl leading-relaxed">
          Draft high-quality correspondence powered by Google Gemini and dispatch direct-to-inbox with Gmail OAuth credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/compose" className="p-5 bg-surface rounded-xl border border-border hover:border-border/80 transition-all duration-150 ease-out active:scale-[0.995] shadow-sm hover:shadow-md flex items-center space-x-4 group cursor-pointer">
          <div className="p-2.5 bg-sidebar rounded-md border border-border/80 shadow-inner group-hover:bg-indigo-500/5 group-hover:border-indigo-500/20 transition-colors">
            <Edit className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <span className="font-semibold text-sm block text-text">Compose Email</span>
            <span className="text-xs text-text-muted">Draft a new message using AI tone mapping</span>
          </div>
        </Link>

        <Link to="/settings" className="p-5 bg-surface rounded-xl border border-border hover:border-border/80 transition-all duration-150 ease-out active:scale-[0.995] shadow-sm hover:shadow-md flex items-center space-x-4 group cursor-pointer">
          <div className="p-2.5 bg-sidebar rounded-md border border-border/80 shadow-inner group-hover:bg-indigo-500/5 group-hover:border-indigo-500/20 transition-colors">
            <Settings className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <span className="font-semibold text-sm block text-text">System Configurations</span>
            <span className="text-xs text-text-muted">Manage API keys, OAuth clients, and appearance</span>
          </div>
        </Link>
      </div>

      <div className="border border-border rounded-xl bg-surface p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted border-b border-border/60 pb-2">Status Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            {hasApiKey ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
            <span className="font-medium">Gemini Integration: {hasApiKey ? 'Ready' : 'Pending'}</span>
          </div>
          <div className="flex items-center space-x-2">
            {hasOauth ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
            <span className="font-medium">OAuth Keys: {hasOauth ? 'Linked' : 'Pending'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">Total Emails Sent: {history.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

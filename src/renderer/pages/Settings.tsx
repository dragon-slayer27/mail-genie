import { useSettingsStore } from '../stores/settingsStore'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function Settings() {
  const { theme, provider, geminiApiKey, googleClientId, googleClientSecret, setTheme, setProvider, setGeminiApiKey, setGoogleCredentials } = useSettingsStore()
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey)
  const [clientIdInput, setClientIdInput] = useState(googleClientId)
  const [clientSecretInput, setClientSecretInput] = useState(googleClientSecret)
  const [isSaved, setIsSaved] = useState(false)
  const [authStatus, setAuthStatus] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApiKeyInput(geminiApiKey)
    setClientIdInput(googleClientId)
    setClientSecretInput(googleClientSecret)
  }, [geminiApiKey, googleClientId, googleClientSecret])

  const handleSave = async () => {
    await setGeminiApiKey(apiKeyInput)
    await setGoogleCredentials(clientIdInput, clientSecretInput)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleGmailAuth = async () => {
    if (!clientIdInput || !clientSecretInput) {
      setAuthStatus('Please enter and save Google Credentials first.')
      return
    }
    setAuthStatus('Authenticating...')
    try {
      const tokens = await window.electron.gmail.authenticate(clientIdInput, clientSecretInput)
      await window.electron.store.setSecure('gmailTokens', JSON.stringify(tokens))
      setAuthStatus('Authentication successful!')
    } catch (e: unknown) {
      setAuthStatus('Authentication failed: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-6 pb-20 bg-surface text-text select-none">
      <div className="pb-3 border-b border-border/80">
        <h2 className="text-xs font-semibold tracking-wide uppercase font-mono">System Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-surface-hover p-5 rounded-lg border border-border/80 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted border-b border-border/50 pb-2">Appearance</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Theme Preference</span>
            <div className="flex p-1 bg-sidebar/50 rounded-lg border border-border/60">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${theme === 'light'
                  ? 'bg-surface text-text shadow-sm border border-border/80'
                  : 'text-text-muted hover:text-text border border-transparent'
                  }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${theme === 'dark'
                  ? 'bg-surface text-text shadow-sm border border-border/80'
                  : 'text-text-muted hover:text-text border border-transparent'
                  }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Provider */}
        <div className="bg-surface-hover p-5 rounded-lg border border-border/80 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted border-b border-border/50 pb-2">AI Provider Configurations</h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium">Active Provider</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 outline-none focus:border-text transition-colors text-xs text-text w-48"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai" disabled>OpenAI (Soon)</option>
                <option value="anthropic" disabled>Anthropic (Soon)</option>
                <option value="ollama" disabled>Ollama (Soon)</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium">Gemini API Key</span>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 outline-none focus:border-text transition-colors text-xs text-text w-full sm:w-80 font-mono"
                placeholder="AIzaSy..."
              />
            </div>
          </div>
        </div>

        {/* Gmail Integration */}
        <div className="bg-surface-hover p-5 rounded-lg border border-border/80 space-y-4 shadow-xs">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted border-b border-border/50 pb-2">Gmail API Authentication</h3>
          <p className="text-xs text-text-muted leading-relaxed">Provide your Google Cloud Console Desktop OAuth Client ID and Secret to link Gmail.</p>

          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium">OAuth Client ID</span>
              <input
                type="text"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 outline-none focus:border-text transition-colors text-xs text-text w-full sm:w-96 font-mono"
                placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium">OAuth Client Secret</span>
              <input
                type="password"
                value={clientSecretInput}
                onChange={(e) => setClientSecretInput(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 outline-none focus:border-text transition-colors text-xs text-text w-full sm:w-96 font-mono"
                placeholder="GOCSPX-..."
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={handleGmailAuth}
                className="bg-surface border border-border text-text px-4 py-2 rounded-md font-semibold text-xs hover:bg-sidebar transition-colors"
              >
                Connect Gmail Account
              </button>
              {authStatus && <span className="text-xs font-mono text-text-muted">{authStatus}</span>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center space-x-4 pt-2">
          {isSaved && <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Settings saved successfully!</span>}
          <button
            onClick={handleSave}
            className="bg-text text-surface px-6 py-2 rounded-md font-semibold text-xs hover:opacity-90 transition-opacity border border-border/10 shadow-xs"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  )
}

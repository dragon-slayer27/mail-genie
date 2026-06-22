import { create } from 'zustand'

interface SettingsState {
  theme: 'light' | 'dark'
  provider: string
  geminiApiKey: string
  geminiModel: string
  googleClientId: string
  googleClientSecret: string
  setTheme: (theme: 'light' | 'dark') => void
  setProvider: (provider: string) => void
  setGeminiApiKey: (key: string) => Promise<void>
  setGeminiModel: (model: string) => void
  setGoogleCredentials: (clientId: string, clientSecret: string) => Promise<void>
  loadSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  provider: 'gemini',
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  googleClientId: '',
  googleClientSecret: '',
  setTheme: (theme) => {
    set({ theme })
    window.electron.store.set('theme', theme)
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },
  setProvider: (provider) => {
    set({ provider })
    window.electron.store.set('provider', provider)
  },
  setGeminiApiKey: async (key) => {
    set({ geminiApiKey: key })
    await window.electron.store.setSecure('geminiApiKey', key)
  },
  setGeminiModel: (model) => {
    set({ geminiModel: model })
    window.electron.store.set('geminiModel', model)
  },
  setGoogleCredentials: async (clientId, clientSecret) => {
    set({ googleClientId: clientId, googleClientSecret: clientSecret })
    await window.electron.store.setSecure('googleClientId', clientId)
    await window.electron.store.setSecure('googleClientSecret', clientSecret)
  },
  loadSettings: async () => {
    const theme = (await window.electron.store.get('theme') as 'light' | 'dark') || 'dark'
    const provider = (await window.electron.store.get('provider') as string) || 'gemini'
    const geminiModel = (await window.electron.store.get('geminiModel') as string) || 'gemini-2.5-flash'
    const geminiApiKey = (await window.electron.store.getSecure('geminiApiKey') as string) || ''
    const googleClientId = (await window.electron.store.getSecure('googleClientId') as string) || ''
    const googleClientSecret = (await window.electron.store.getSecure('googleClientSecret') as string) || ''

    set({ theme, provider, geminiModel, geminiApiKey, googleClientId, googleClientSecret })
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }
}))

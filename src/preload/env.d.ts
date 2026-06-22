/// <reference types="vite/client" />

interface Window {
  electron: {
    store: {
      get(key: string): Promise<unknown>
      set(key: string, val: unknown): Promise<void>
      getSecure(key: string): Promise<string | null>
      setSecure(key: string, val: string): Promise<void>
    }
    gmail: {
      authenticate(clientId: string, clientSecret: string): Promise<unknown>
      send(tokens: unknown, clientId: string, clientSecret: string, to: string, subject: string, body: string, cc?: string, bcc?: string): Promise<unknown>
    }
  }
}

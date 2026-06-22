import { contextBridge, ipcRenderer } from 'electron'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      store: {
        get(key: string) {
          return ipcRenderer.invoke('store:get', key)
        },
        set(key: string, val: unknown) {
          return ipcRenderer.invoke('store:set', key, val)
        },
        getSecure(key: string) {
          return ipcRenderer.invoke('secure:get', key)
        },
        setSecure(key: string, val: string) {
          return ipcRenderer.invoke('secure:set', key, val)
        }
      },
      gmail: {
        authenticate(clientId: string, clientSecret: string) {
          return ipcRenderer.invoke('gmail:authenticate', clientId, clientSecret)
        },
        send(tokens: unknown, clientId: string, clientSecret: string, to: string, subject: string, body: string, cc?: string, bcc?: string) {
          return ipcRenderer.invoke('gmail:send', tokens, clientId, clientSecret, to, subject, body, cc, bcc)
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = {
    store: {
      get(key: string) {
        return ipcRenderer.invoke('store:get', key)
      },
      set(key: string, val: unknown) {
        return ipcRenderer.invoke('store:set', key, val)
      },
      getSecure(key: string) {
        return ipcRenderer.invoke('secure:get', key)
      },
      setSecure(key: string, val: string) {
        return ipcRenderer.invoke('secure:set', key, val)
      }
    },
    gmail: {
      authenticate(clientId: string, clientSecret: string) {
        return ipcRenderer.invoke('gmail:authenticate', clientId, clientSecret)
      },
      send(tokens: unknown, clientId: string, clientSecret: string, to: string, subject: string, body: string, cc?: string, bcc?: string) {
        return ipcRenderer.invoke('gmail:send', tokens, clientId, clientSecret, to, subject, body, cc, bcc)
      }
    }
  }
}

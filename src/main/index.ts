import { app, shell, BrowserWindow, ipcMain, safeStorage } from 'electron'
import { join } from 'path'
import Store from 'electron-store'
import { authenticateGmail, sendEmailWithGmail } from './services/gmail/auth'

const store = new Store()

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    autoHideMenuBar: true,
    title: 'Mail Genie',
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// basic IPC for electron-store
ipcMain.handle('store:get', (_, key) => {
  return store.get(key)
})

ipcMain.handle('store:set', (_, key, val) => {
  store.set(key, val)
})

ipcMain.handle('secure:set', (_, key, val) => {
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(val)
    store.set(key, encrypted.toString('base64'))
  } else {
    store.set(key, val)
  }
})

ipcMain.handle('secure:get', (_, key) => {
  const val = store.get(key) as string | undefined
  if (!val) return val

  if (safeStorage.isEncryptionAvailable()) {
    try {
      const buffer = Buffer.from(val, 'base64')
      return safeStorage.decryptString(buffer)
    } catch (e) {
      console.error('Failed to decrypt value for key', key, e)
      return null
    }
  }
  return val
})

ipcMain.handle('gmail:authenticate', async (_, clientId, clientSecret) => {
  return authenticateGmail(clientId, clientSecret)
})

ipcMain.handle('gmail:send', async (_, tokens, clientId, clientSecret, to, subject, body, cc, bcc) => {
  return sendEmailWithGmail(tokens, clientId, clientSecret, to, subject, body, cc, bcc)
})


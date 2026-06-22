import { google, Auth } from 'googleapis'
import { BrowserWindow } from 'electron'

export function authenticateGmail(clientId: string, clientSecret: string): Promise<Auth.Credentials> {
  return new Promise((resolve, reject) => {
    let resolved = false
    const redirectUri = 'http://localhost'
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/gmail.send']
    })

    const authWindow = new BrowserWindow({
      width: 600,
      height: 800,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    authWindow.loadURL(authUrl)

    authWindow.webContents.on('will-redirect', async (event, url) => {
      if (url.startsWith(redirectUri)) {
        event.preventDefault()
        const rawCode = new URL(url).searchParams.get('code')
        if (rawCode) {
          try {
            const { tokens } = await oAuth2Client.getToken(rawCode)
            resolved = true
            resolve(tokens)
          } catch (e) {
            resolved = true
            reject(e)
          }
        } else {
          resolved = true
          reject(new Error('Auth failed, no code returned'))
        }
        authWindow.close()
      }
    })

    authWindow.on('closed', () => {
      if (!resolved) {
        reject(new Error('User closed the window'))
      }
    })
  })
}

export async function sendEmailWithGmail(tokens: Auth.Credentials, clientId: string, clientSecret: string, to: string, subject: string, body: string, cc?: string, bcc?: string) {
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oAuth2Client.setCredentials(tokens)

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  const messageParts = [
    `To: ${to}`,
    cc ? `Cc: ${cc}` : null,
    bcc ? `Bcc: ${bcc}` : null,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body
  ].filter(part => part !== null)

  const message = messageParts.join('\n')
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  })

  return res.data
}

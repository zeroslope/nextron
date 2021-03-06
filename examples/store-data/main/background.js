import { join } from 'path'
import { app, ipcMain } from 'electron'
import { createWindow, exitOnChange } from './helpers'
import * as Store from 'electron-store'

const isProd = process.env.NODE_ENV === 'production'

if (!isProd) {
  exitOnChange()

  const userDataPath = app.getPath('userData')
  app.setPath('userData', `${userDataPath} (development)`)
}

const store = new Store({ name: 'messages' })

ipcMain.on('get-messages', (event, arg) => {
  event.returnValue = store.get('messages') || []
})

ipcMain.on('add-message', (event, arg) => {
  const messages = store.get('messages') || []
  messages.push(arg)
  store.set('messages', messages)
})

app.on('ready', () => {
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })

  if (isProd) {
    const homeFile = join(app.getAppPath(), 'app/home/index.html')
    mainWindow.loadFile(homeFile)
  } else {
    const homeUrl = 'http://localhost:8888/home'
    mainWindow.loadURL(homeUrl)
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})

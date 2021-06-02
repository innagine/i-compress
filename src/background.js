/*
 * @Description: file contentIMAGINE
 * @Author: IMAGINE
 * @Date: 2021-05-27 14:43:25
 * @LastEditors: IMAGINE
 * @LastEditTime: 2021-06-03 00:17:25
 */
'use strict'

import { app, protocol, BrowserWindow, ipcMain, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import imageCompress from './utils/compress-image'
import transformPNG from './utils/tranform-png'
import transformJPG from './utils/tranform-jpg'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let BrowerWindow = null

async function createWindow() {
  // Create the browser window.
  Menu.setApplicationMenu(null)
  BrowerWindow = new BrowserWindow({
    width: 800,
    height: 660,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,// 取消跨域限制
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await BrowerWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) BrowerWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    BrowerWindow.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// 图片压缩：接收 页面发来的消息，arg 为消息参数
ipcMain.on('compress-image', async (event, arg) => { 
  const status = await imageCompress(arg)
  console.log('compress-status')
  BrowerWindow.webContents.send('compress-status', status)
})

// 图片转成png：接收 页面发来的消息，arg 为消息参数
ipcMain.on('transform-png', async (event, arg) => { 
  const status = await transformPNG(arg)
  console.log('png-status')
  BrowerWindow.webContents.send('png-status', status)
})

// 图片转成jpg：接收 页面发来的消息，arg 为消息参数
ipcMain.on('transform-jpg', async (event, arg) => { 
  const status = await transformJPG(arg)
  console.log('jpg-status')
  BrowerWindow.webContents.send('jpg-status', status)
})

const { app, BrowserWindow } = require('electron')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

let mainWindow
let serverProcess

const isDev = !app.isPackaged

function getDatabasePath() {
  const userData = app.getPath('userData')

  const prismaDir = path.join(userData, 'prisma')

  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true })
  }

  return path.join(prismaDir, 'dev.db')
}

function initializeDatabase() {
  const dbPath = getDatabasePath()

  process.env.DATABASE_URL =
    `file:${dbPath.replace(/\\/g, '/')}`
}

async function startNextServer() {
  initializeDatabase()

  const nextBin = isDev
    ? require.resolve('next/dist/bin/next')
    : path.join(
        process.resourcesPath,
        'node_modules',
        'next',
        'dist',
        'bin',
        'next'
      )

  const appPath = isDev
    ? app.getAppPath()
    : process.resourcesPath

  const mode = isDev ? 'dev' : 'start'

  serverProcess = spawn(
    process.execPath,
    [nextBin, mode, '-p', '3002'],
    {
      cwd: appPath,

      env: {
        ...process.env,
        NODE_ENV: isDev ? 'development' : 'production',
      },

      stdio: 'pipe',
    }
  )

  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString())
  })

  return new Promise((resolve) => {
    setTimeout(resolve, 8000)
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.loadURL('http://localhost:3002')
}

app.whenReady().then(async () => {
  await startNextServer()

  createWindow()
})

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill()
  }

  app.quit()
})
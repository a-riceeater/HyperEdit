const { app, BrowserWindow } = require('electron')
const path = require('path')
const remote = require('@electron/remote/main')
remote.initialize()

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            //preload: path.join(__dirname, 'preload.js')
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: true,
        fullscreen: true,
        autoHideMenuBar: true
    })

    win.loadFile(path.join(__dirname, "os/startup.html"))
    // win.removeMenu();
    remote.enable(win.webContents)
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
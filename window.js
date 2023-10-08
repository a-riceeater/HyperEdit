const { app, BrowserWindow, Menu } = require('electron')
const path = require('path');

const VERSION = "1.0.0"

function createMainWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: true
        },
        resizable: true,
        frame: process.platform == "darwin" ? true : false,
        contextIsolation: false,
        enableRemoteModule: true,
        titleBarStyle: process.platform == "darwin" ? 'hidden' : null,
    })

    win.loadFile(path.join(__dirname, "page", "window.html"))
    setMainMenu(win);
}

function setMainMenu(win) {
    const isMac = process.platform === 'darwin'

    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { 
                        label: "Check for updates",
                        click() {
                            // search for updates
                            console.log("Searching for updates...")
                        }
                     },
                    { role: 'quit' }
                ]
            }]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                {
                    label: "New File",
                    accelerator: "Cmd+N"
                },
                {
                    label: "New Window",
                    accelerator: "Cmd+Shift+N"
                },
                { type: "separator" },
                {
                    label: "Open File",
                    accelerator: "Cmd+O"
                },
                {
                    label: "Open Folder",
                    accelerator: "Cmd+Shift+O",
                    click() {
                        openFolder();
                    }
                },
                { type: "separator" },
                {
                    label: "Save",
                    accelerator: "Cmd+S"
                },
                { type: "separator" },
                {
                    label: "Close File",
                    accelerator: "Cmd+W"
                },
                {
                    label: "Close Window",
                    accelerator: "Cmd+shift+W",
                    click() {
                        win.close()
                    }
                }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                        { role: 'pasteAndMatchStyle' },
                        { role: 'delete' },
                        { role: 'selectAll' },
                        { type: 'separator' },
                        {
                            label: 'Speech',
                            submenu: [
                                { role: 'startSpeaking' },
                                { role: 'stopSpeaking' }
                            ]
                        }
                    ]
                    : [
                        { role: 'delete' },
                        { type: 'separator' },
                        { role: 'selectAll' }
                    ])
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ]
                    : [
                        { role: 'close' }
                    ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

function createLoaderWindow() {
    const win = new BrowserWindow({
        height: 450,
        width: 330,
        frame: false,
        resizable: false
    })

    win.loadFile(path.join(__dirname, "page", "updater.html"));
    
    setTimeout(() => {
        win.close();
        createMainWindow();
    }, 3000)
}

app.whenReady().then(() => {
    createMainWindow() //createLoaderWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createLoaderWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

const { dialog, ipcMain } = require("electron");
const fs = require("fs");

ipcMain.handle("openFolder", openFolder);

async function openFolder() {
    const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    return result;
}

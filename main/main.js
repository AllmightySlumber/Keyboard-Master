const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
console.log('main process working');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    // Chargement du fichier html sur la page
    win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));
};

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows.length === 0) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('detect-spacing', (event, text) => {
    console.log(text);
});
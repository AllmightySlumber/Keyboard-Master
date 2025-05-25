const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
console.log('main process working');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        minHeight: 400,
        minWidth: 600,
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

// Importer du texte à partir d'un fichier txt
ipcMain.handle('import-text', async () => {
    try {
        // Fenêtre d'importation (renvoie un object bool et une liste)
        const { canceled, filePaths } = await dialog.showOpenDialog({
            title: 'Importer un nouveau texte',
            filters: [{ name: 'Fichiers texte', extensions: ['txt'] }],
            properties: ['openFile']
        });

        if (canceled || filePaths ===0 ) return []; // Vérification sur le bool et la liste renvoyé

        const importedText = fs.readFileSync(filePaths[0], 'utf-8');     // Récupération des données du fichier qu'on importe

        return importedText;    // envoie à l'interface du text importer
    } catch (error) {
        console.log("Erreur lors de l'import :", error);
        return [];
    }
}) ;
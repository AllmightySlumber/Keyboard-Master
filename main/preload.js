console.log('Preload working just fine.');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    importText: () => ipcRenderer.invoke('import-text'),
});
console.log('Preload working just fine.');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    detectSpacing: (text) => ipcRenderer.send('detect-spacing', text),
});
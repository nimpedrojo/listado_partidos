// electron/main.js
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import generarListado from '../src/core/generarListado.js';
import { fileURLToPath } from 'url';
import open from 'open';
// 2. recreamos __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function createWindow () {
  const win = new BrowserWindow({
    width: 900, height: 750, resizable: false,
    webPreferences: { preload: path.join(__dirname, 'preload.cjs') }
  });
  await win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

ipcMain.handle('generar', async (_event, ini, fin) => {
  const pdf = await generarListado(ini, fin);
   open('../output/preview.html', {app: {name: 'chrome'}});
});

app.whenReady().then(createWindow);

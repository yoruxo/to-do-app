const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, '../frontend/dist/index.html');
const useBuilt = app.isPackaged || fs.existsSync(distPath);

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 400,
    minHeight: 400,
    title: 'Task Manager',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (useBuilt) {
    win.loadFile(distPath);
  } else {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

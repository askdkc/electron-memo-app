const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,  // Set minimum width
    minHeight: 600, // Set minimum height
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools(); // Uncomment for debugging
}

app.whenReady().then(() => {
  db = new Database();
  db.initialize();
  
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for database operations
ipcMain.handle('get-memos', async () => {
  return await db.getAllMemos();
});

ipcMain.handle('add-memo', async (_, memoData) => {
  return await db.addMemo(memoData);
});

ipcMain.handle('update-memo', async (_, memoData) => {
  return await db.updateMemo(memoData);
});

ipcMain.handle('delete-memo', async (_, id) => {
  return await db.deleteMemo(id);
});

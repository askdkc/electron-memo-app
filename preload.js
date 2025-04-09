const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getMemos: () => ipcRenderer.invoke('get-memos'),
  addMemo: (memo) => ipcRenderer.invoke('add-memo', memo),
  updateMemo: (memo) => ipcRenderer.invoke('update-memo', memo),
  deleteMemo: (id) => ipcRenderer.invoke('delete-memo', id)
});

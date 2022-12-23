const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const spawn = require("cross-spawn")
const Store = require('electron-store');
const { basename, dirname, join } = require('path')

const schema = {
  projects: {
    type: 'string',
  }
}

const store = new Store({ schema, name: 'storage'});

const createWindow = () => {
  const win = new BrowserWindow({
    icon: __dirname+'/assets/logo.png',
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    width: 225,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('pages/home.html');
  //win.webContents.openDevTools()

  ipcMain.on('closeApp', () => {
    win.close();
  })
  ipcMain.on('minimizeApp', () => {
    win.minimize();
  })
}


app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('pathApp', async (event, args) => {
  const {filePaths, canceled} = await dialog.showOpenDialog({ properties: ['openDirectory']})
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  if (canceled) return;

  store.set('projects', JSON.stringify([ ... projects, {
    name: basename(filePaths[0]),
    path: filePaths
  }]));

  const storedProjects2 = store.get('projects');
  const projects2 = storedProjects2 ? JSON.parse(storedProjects2) : [];

  event.returnValue = projects2;
})

ipcMain.on('clickApp', (event, args) => {
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  
  spawn.sync('code',[projects[args]['path']]);
})

ipcMain.on('removeApp', (event, args) => {
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];
  const removedProjects = JSON.stringify(projects.filter(item => item.path != projects[args]['path']))
  store.set('projects',removedProjects),
  
  event.returnValue = JSON.parse(removedProjects);
})

ipcMain.on('refreshApp', (event, args) => {
  const storedProjects = store.get('projects');
  const projects = storedProjects ? JSON.parse(storedProjects) : [];

  event.returnValue = projects;
})
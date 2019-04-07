// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let editorWindow = null

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 720,
    center: true,
    resizable: true,
    maximizable: true,
    fullscreenable: false,
    title: "Mi Band 2 Date Language Editor",
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenu(null);
  
  mainWindow.center();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;

    if(editorWindow != null) {
      editorWindow.destroy();
      editorWindow = null;
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ipc-main: sending messages
// In main process.
const { ipcMain } = require('electron')

ipcMain.on('openEditor', (event, arg) => {
  // console.log(arg) // DEV

  if(editorWindow != null) {
    editorWindow.destroy();
    editorWindow = null;
  }

  editorWindow = new BrowserWindow({ 
    width: 600,
    minWidth: 600,
    height: 800,
    minHeight: 800,
    center: true,
    resizable: true,
    maximizable: true,
    fullscreenable: false,
    title: "Mi Band 2 Date Language Editor",
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true
    }
  })

  editorWindow.setMenu(null);
    
  editorWindow.center();

  // and load the index.html of the app.
  editorWindow.loadURL(`file://${__dirname}/editorWindow.html`);
  
  // Open the DevTools.
  //editorWindow.webContents.openDevTools()

  // set the app value to null when closed
  editorWindow.on('closed', () => {
    editorWindow = null
  })

  editorWindow.webContents.on('did-finish-load', () => {
    editorWindow.webContents.send('char-data', arg);
  })

  event.returnValue = arg
})

ipcMain.on('closeEditor', (event, arg) => {
  editorWindow.destroy();
  editorWindow = null;
})

ipcMain.on('saveEditor', (event, arg) => {
  // console.log(arg); // DEV

  editorWindow.destroy();
  editorWindow = null;

  mainWindow.webContents.send('saved-char-data', arg);
})

// dialog: open a firmware file test
// data through ipc-main
const { dialog } = require('electron')
const fs = require('fs')

app.on('ready', () => {
  ipcMain.on('openFirmwareDialog', (event, arg) => {

    var openFirmwareDialog = dialog.showOpenDialog(
      { title: 'Please select the Mi Band 2 Firmware File you want to edit', 
        filters: [
          { name: 'Firmware file', extensions: ['fw'] }
        ],
          properties: ['openFile', 'showHiddenFiles', 'createDirectory']
      });

    // console.log(openFirmwareDialog[0]); // DEV

    var firmwareFile = fs.readFileSync(openFirmwareDialog[0]);
    //console.log(firmwareFile);
    mainWindow.webContents.send('opened-firmware-data', firmwareFile);
    event.returnValue = {status: "work in progress" };
  })

  ipcMain.on('save-firmware', (event, arg) => {
    // console.log("save-firmware: " + JSON.parse(arg).data.length) // DEV

    var fileBuffer = Buffer.from(JSON.parse(arg).data);

    var saveFirmwareDialog = dialog.showSaveDialog(
      { title: 'Please select where to save your new edited firmware file.', 
        filters: [
          { name: 'Firmware file', extensions: ['fw'] }
        ],
        properties: ['saveFile', 'showHiddenFiles', 'createDirectory']
      });

    // console.log(saveFirmwareDialog); // DEV

    fs.writeFileSync(saveFirmwareDialog, fileBuffer);

    event.returnValue = {status: "success" };
  })

  ipcMain.on('load-table-data', (event, arg) => {
    // console.log("load-table-data: " + arg) // DEV

    var loadTableDataDialog = dialog.showOpenDialog(
      { title: 'Please select from where to load your table data.', 
        filters: [
          { name: 'TableData', extensions: ['mi2'] }
        ],
        properties: ['loadFile', 'showHiddenFiles', 'createDirectory']
      });

    // console.log(loadTableDataDialog[0]); // DEV

    var data = fs.readFileSync(loadTableDataDialog[0], { encoding: 'utf8' });
    // console.log(data); // DEV
    mainWindow.webContents.send('loaded-table-data', data);

    event.returnValue = {status: "success" };
  })

  ipcMain.on('save-table-data', (event, arg) => {
    // console.log("save-table-data: " + arg) // DEV

    var saveTableDataDialog = dialog.showSaveDialog(
      { title: 'Please select where to store your table data for future editing or sharing.', 
        filters: [
          { name: 'tableData', extensions: ['mi2'] }
        ],
        properties: ['saveFile', 'showHiddenFiles', 'createDirectory']
      });

    // console.log(saveTableDataDialog); // DEV

    fs.writeFileSync(saveTableDataDialog, arg, { encoding: 'utf8' });

    event.returnValue = {status: "success"};
  })

  ipcMain.on('close-app', (event, arg) => {
    app.quit()
    event.returnValue = {status: "success"};
  });

  ipcMain.on('window-minimize', (event, arg) => {
    mainWindow.minimize();
    event.returnValue = {status: "success" };
  });

  ipcMain.on('window-maximize', (event, arg) => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
   
    event.returnValue = {status: mainWindow.isMaximized() };
  });

  ipcMain.on('window-close', (event, arg) => {
    app.quit()
    event.returnValue = {status: "success" };
  });
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

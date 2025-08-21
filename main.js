const { app, BrowserWindow, Menu, ipcMain, dialog, Notification } = require('electron');
const path = require('path');

// Crea la ventana principal de la aplicación
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Carga el archivo HTML que contiene la interfaz del juego
  win.loadFile('index.html');
}

// Escucha un mensaje del proceso de renderizado para mostrar una notificación
ipcMain.on('show-notification', (event, title, body) => {
  new Notification({
    title: title,
    body: body
  }).show();
});

// Cuando Electron está listo, crea la ventana de la aplicación
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // En macOS, si no hay ventanas abiertas, se crea una nueva
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Cuando todas las ventanas se cierran, la aplicación se cierra (excepto en macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Definición del menú nativo de la aplicación
const template = [
  {
    label: 'Juego',
    submenu: [
      {
        label: 'Reiniciar',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          BrowserWindow.getFocusedWindow().reload();
        }
      },
      { type: 'separator' },
      {
        label: 'Salir',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Ayuda',
    submenu: [
      {
        label: 'Acerca de',
        click: () => {
          dialog.showMessageBox({
            type: 'info',
            title: 'Acerca de',
            message: 'Tetris en Electron JS\nDesarrollado para el proyecto BTS SIO'
          });
        }
      }
    ]
  }
];

// Construye y establece el menú de la aplicación
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
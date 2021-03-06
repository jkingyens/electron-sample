const {app, BrowserWindow} = require('electron')
const dockerode = require('dockerode')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // load a normal web page here?
  win2 = new BrowserWindow({width: 800, height: 600, chrome: true})
  win2.loadURL('https://stripe.com')
  win2.on('closed', () => {
    win2 = null
  })
  win2.on('app-command', (e, cmd) => {
  // Navigate the window back when the user hits their mouse back button
  if (cmd === 'browser-backward' && win2.webContents.canGoBack()) {
    win2.webContents.goBack()
  }
})

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  // create browser window
  createWindow();

  // connect with docker & test environment
  var docker = new dockerode({socketPath: '/var/run/docker.sock'});

  // pull docker image
  docker.pull('busybox:latest', (err, stream) => {

    if (err) {
      return console.error('error pulling docker image')
    }

    console.log('pull has started')
    stream.on('data', (data) => {
      console.log(data.toString())
    });

    stream.on('end', () => {
      console.log('stream is pulled')
    });

  });

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

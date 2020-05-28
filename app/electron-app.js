import {ipcMain, BrowserView, WebFrame, BrowserWindow} from 'electron';

let simulatorWindow;

export function setupIpc(windows) {
  ipcMain.on('guest_sessionStarted', (event, callUrl) => {
    console.log(`guest opening call ${callUrl}`);
    const window = getWindow(windows, event);
    openMeet(window, callUrl);
  });

  ipcMain.on('host_sessionStarted', (event, callUrl, simulatorUrl) => {
    console.log(`host opening call ${callUrl} simulator ${simulatorUrl}`);

    const window = getWindow(windows, event);
    openMeet(window, callUrl);
    resizeForHost(window);
    startStreamingWindow(window, simulatorUrl);
  });

  ipcMain.on('host_inputFromGuest', (_, input) => {
    // simulate input
    simulatorWindow.webContents.sendInputEvent(input);
  });
}

function getWindow(windows, event) {
  const id = event.sender.browserWindowOptions.myId;
  return windows[id];
}


function openMeet(window, url) {
  const meetWindow = new BrowserView();
  window.addBrowserView(meetWindow);

  const windowBounds = window.getBounds();
  const meetBounds = {
    x: 0,
    y: 0,
    width: Math.floor(windowBounds.width / 3),
    height: windowBounds.height
  };
  meetWindow.setBounds(meetBounds);

  meetWindow.webContents.loadURL(url);
}

function resizeForHost(window){
  //const oldBounds = window.getBounds();
  window.setBounds({
    x:200,
    y: 100,
    width: 300,
    height: 600
  });
}

function startStreamingWindow(window, simulatorUrl) {
  simulatorWindow = new BrowserWindow({
    title: 'hostBrowser',
    show: false,
    width: 1024,
    height: 728,
    myId: 'simulator'
  });
  simulatorWindow.loadURL(simulatorUrl);
  simulatorWindow.webContents.on('did-finish-load', () => {
    simulatorWindow.show();
    simulatorWindow.focus();
    simulatorWindow.setTitle("hostBrowser");
  });
}

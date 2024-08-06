const { app, BrowserWindow, ipcMain } = require('electron');
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
const socket = require('socket.io-client')('http://192.168.0.100:5000');

let mainWindow;
let interval;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 150,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.removeMenu();
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on("start-share", function(event, arg) {
    var uuid = uuidv4();
    console.log("Generated UUID:", uuid); // Debug log
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(function() {
        screenshot().then((img) => {
            var imgStr = new Buffer(img).toString('base64');
            var obj = { room: uuid, image: imgStr };
            socket.emit("screen-data", JSON.stringify(obj));
        });
    }, 100);
});


ipcMain.on("stop-share", (event, arg) => {
    clearInterval(interval);
});

socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});


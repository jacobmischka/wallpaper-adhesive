'use strict';

var electron = require('electron');

let win;

function createWindow(){
	win = new electron.BrowserWindow({ width: 800, height: 600 });

	win.loadURL(`file://${__dirname}/index.html`);

	win.on('closed', () => {
		win = null;
	});
}

electron.app.on('ready', createWindow);

electron.app.on('window-all-closed', () => {
	electron.app.quit();
});

electron.app.on('activate', () => {
	if(win === null)
		createWindow();
});
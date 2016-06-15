'use strict';
const electron = require('electron');
const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

var path = require('path');

process.env.PROJECT_ROOT = extractActionhero();
console.log('project root: ' + process.env.PROJECT_ROOT);

var actionheroPrototype = require('actionhero').actionheroPrototype;
var actionhero = new actionheroPrototype();
actionhero.start({}, function(error, api) {console.log("ACTIONHERO RUNNING!")});

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 800,
		height: 600
	});

	win.loadURL(`file://${process.env.PROJECT_ROOT}/public/chat.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

function extractActionhero() {
	var ah = 'actionhero';
	var src = path.join(app.getAppPath(), ah);
	var dst = path.join(app.getPath('userData'), ah);
	console.log('extracting from ' + src + ' to ' + dst);

	var fs = require('fs-extra');
	fs.emptyDirSync(dst);
	fs.copySync(src, dst, {
		filter: function (path) {
			return ! path.endsWith('.gitkeep');
		}
	});
	return dst;
}
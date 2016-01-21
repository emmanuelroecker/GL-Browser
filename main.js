'use strict';
const electron = require('electron');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	console.log('Electron Version : ' + process.versions.electron);

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});
	mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

	let filter = yaml.safeLoad(fs.readFileSync('filter.yml', 'utf8'));
	let ses = mainWindow.webContents.session;
	ses.webRequest.onBeforeRequest({
		urls: filter
	}, function (details, callback) {
		callback({
			cancel: true
		});
	});

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
});

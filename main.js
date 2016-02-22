/*
Copyright (C) 2016
Emmanuel ROECKER and Rym BOUCHAGOUR
http://dev.glicer.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

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
	console.log(`Electron Version : ${process.versions.electron}`);

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});
	mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));

	let filter = yaml.safeLoad(fs.readFileSync('filter.yml', 'utf-8'));
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

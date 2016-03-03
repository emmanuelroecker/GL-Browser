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

console.log(`Electron Version : ${process.versions.electron}`);

class mainProcessClass {
	constructor(encoding) {
		this._modElectron = require('electron');
		this._modYaml = require('js-yaml');
		this._modFs = require('fs');
		this._modPath = require('path');
		this._modBlock = require('./components/block/block.js');
    this._app = this._modElectron.app;

		this._encoding = encoding;
		this._indexHtmlFile = 'index.html';

    this.init();
	}


	init() {
		this._app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				this._app.quit();
			}
		});

		this._app.on('ready', () => {
			this._mainWindow = new this._modElectron.BrowserWindow({
				width: 800,
				height: 600
			});
			this._mainWindow.loadURL(this._modPath.join('file://', __dirname, this._indexHtmlFile));

			this._modBlock.block(this._mainWindow);

			this._mainWindow.on('closed', () => {
				this._mainWindow = null;
			});
		});
	}
}

let mainProcess = new mainProcessClass("utf8");

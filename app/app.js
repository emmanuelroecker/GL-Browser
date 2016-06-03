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
const blockClass = require('./js/block/block.js');
class mainProcessClass {
	constructor() {
		this._modElectron = require('electron');
		this._modYaml = require('js-yaml');
		this._modFs = require('fs');
		this._modPath = require('path');
		this._yargs = require('yargs');
		this._modBlock = new blockClass();

		this._encoding = 'utf8';
		this._mainHtmlFile = './index.html';

		this.parseCommandLine();
		this.init();
	}

	parseCommandLine() {
		let options = this._yargs(process.argv).wrap(100);
		options.usage('Electron command line');
		options.alias('d', 'debug').boolean('1').describe('1', 'Autostart dev tools');
		options.alias('u', 'userdata').string('u').describe('u', 'set userdata directory');
		options.alias('v', 'version').boolean('v').describe('v', 'Print the version.');
		options.alias('h', 'help').boolean('h').describe('h', 'Print this usage message.');

		this._args = options.argv;

		if (this._args.help) {
			process.stdout.write(options.help());
			process.exit(0);
		}

		if (this._args.version) {
			process.stdout.write(`Electron Version : ${process.versions.electron}\n`);
			process.stdout.write('GLBrowser Version : 0.0.1\n');
			process.exit(0);
		}
	}

	init() {
		this._app = this._modElectron.app;
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
			let mainHtml = this._modPath.join(__dirname, this._mainHtmlFile);
			this._mainWindow.loadURL('file://' + mainHtml);
			if (this._args.debug) {
				this._mainWindow.webContents.openDevTools();
			}
			this._modBlock.block(this._mainWindow, __dirname + '/cfg/block/block.yml');

			this._mainWindow.on('closed', () => {
				this._mainWindow = null;
			});
		});
	}
}

global.mainProcess = new mainProcessClass();

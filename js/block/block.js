/*
Copyright (C) 2016
Emmanuel ROECKER and Rym BOUCHAGOUR
http://dev.glicer.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
'use strict';

class blockClass {
	constructor() {
		this._modFs = require('fs');
		this._modYaml = require('js-yaml');
		this._encoding = 'utf8';
	}

	block(window, blockCfgFile) {
		try {
			this._modFs.statSync(blockCfgFile);
		} catch (e) {
			console.log('Block file does not exist : ' + blockCfgFile);
			return;
		}
		let filter = this._modYaml.safeLoad(this._modFs.readFileSync(blockCfgFile, this._encoding));
		let ses = window.webContents.session;
		ses.webRequest.onBeforeRequest({
			urls: filter
		}, function (details, callback) {
			callback({
				cancel: true
			});
		});
	}
}

module.exports = blockClass;

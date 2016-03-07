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

class autologinClass {
	constructor(encoding) {
		this._modFs = require('fs');
		this._modPath = require('path');
		this._modCrypt = require('../crypt/crypt.js');
		this._modYaml = require('js-yaml');
		this._modMatchPattern = require('match-pattern');
		this._encoding = encoding;
		this._autologinCfgFile = 'autologin.yml';
		this._autologinJsFile = 'autologin.js';
		this._autologinTemplate = '%autologinjs%';
		this._loginMessage = 'login';
		this._injectJsFile = 'inject.js';
		this._masterPasswordEnable = false;
		this._masterPasswordHash = '';
		this._masterPassword = '';
		this.init();
	}

	init() {
		try {
			this._injectJS = this._modFs.readFileSync(this._modPath.join(__dirname, this._injectJsFile), this._encoding);
			this._autologin = this._modYaml.safeLoad(this._modFs.readFileSync(this._modPath.join(__dirname, this._autologinCfgFile), this._encoding));
		} catch (e) {
			console.log(e);
		}

		this._masterPasswordHash = this._autologin.shift().hash;

		this._autologin = this._autologin.map(elem => {
			elem.js = this.getJS(elem.name);
			elem.patterns = this.compilePatterns(elem.patterns);
			return elem;
		});
	}

	getToInject(url) {
		for (let elem of this._autologin) {
			let patterns = elem.patterns;
			for (let pattern of patterns) {
				if (pattern.test(url)) {
					let cloneElem = Object.assign({}, elem);
					cloneElem.user = {};
					cloneElem.user.login = this._modCrypt.decrypt(elem.login,this._masterPassword);
					cloneElem.user.password = this._modCrypt.decrypt(elem.password,this._masterPassword);
					return cloneElem;
				}
			}
		}
	}

	getJS(name) {
		let js = '';
		try {
			let customizejs = this._modFs.readFileSync(this._modPath.join(__dirname, name, this._autologinJsFile), this._encoding);
			js = this._injectJS.replace(this._autologinTemplate, customizejs);
		} catch (e) {
			console.log(e);
		}
		return js;
	}

	compilePatterns(patterns) {
		return patterns.map(pattern => {
			pattern = this._modMatchPattern.parse(pattern);
			if (pattern === null) {
				console.log(`Bad pattern : ${pattern}`);
			}
			return pattern;
		});
	}

	inject(webview) {
		if (!this._masterPasswordEnable)
			return;
		let inject = this.getToInject(webview.src);
		if (inject) {
			webview.executeJavaScript(inject.js);
			webview.send(this._loginMessage, inject.user);
		}
	}

	setMasterPassword(masterPassword) {
		if (this._modCrypt.hash(masterPassword) != this._masterPasswordHash) {
			return false;
		}
		this._masterPassword = masterPassword;
		this._masterPasswordEnable = true;
		return true;
	}
}

module.exports = new autologinClass('utf8');

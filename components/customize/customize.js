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

class customizeClass {
	constructor(encoding) {
		this._modFs = require('fs');
		this._modYaml = require('js-yaml');
		this._modMatchPattern = require('match-pattern');
		this._modPath = require('path');
		this._encoding = encoding;
		this._customizeCfgFile = 'customize.yml';
		this._customizeJsFile = 'customize.js';
		this._customizeCssFile = 'customize.css';
		this._customizeTemplate = '%customizejs%';
		this._injectJsFile = 'inject.js';
		this.init();
	}

	init() {
		try {
			this._injectJS = this._modFs.readFileSync(this._modPath.join(__dirname, this._injectJsFile), this._encoding);
			this._customize = this._modYaml.safeLoad(this._modFs.readFileSync(this._modPath.join(__dirname, this._customizeCfgFile), this._encoding));
		} catch (e) {
			console.error(e);
		}

		this._customize = this._customize.map(elem => {
			elem.css = this.getCSS(elem.name);
			elem.js = this.getJS(elem.name);
			elem.patterns = this.compilePatterns(elem.patterns);
			return elem;
		});
	}

	getToInject(url) {
		for (let elem of this._customize) {
			let patterns = elem.patterns;
			for (let pattern of patterns) {
				if (pattern.test(url)) {
					let cloneElem = Object.assign({}, elem);
					return cloneElem;
				}
			}
		}
	}

	getJS(name) {
		let js = '';
		try {
			let customizejs = this._modFs.readFileSync(this._modPath.join(__dirname, name, this._customizeJsFile), this._encoding);
			js = this._injectJS.replace(this._customizeTemplate, customizejs);
		} catch (e) {
			console.error(e);
		}
		return js;
	}

	getCSS(name) {
		let css = '';
		try {
			css = this._modFs.readFileSync(this._modPath.join(__dirname, name, this._customizeCssFile), this._encoding);
		} catch (e) {
			console.error(e);
		}
		return css;
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
		let inject = this.getToInject(webview.src);
		if (inject) {
			webview.insertCSS(inject.css);
			webview.executeJavaScript(inject.js);
		}
	}
}

module.exports = new customizeClass('utf8');

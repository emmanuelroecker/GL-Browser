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

/* global window, $ */

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const matchPattern = require('match-pattern');
const path = require('path');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

const directoryInject = path.join(__dirname, 'inject');
const encoding = 'utf-8';

let cfg;
let templatejs;

try {
	templatejs = fs.readFileSync(path.join(directoryInject, 'inject.js'), encoding);
	cfg = yaml.safeLoad(fs.readFileSync(path.join(directoryInject, 'inject.yml'), encoding));
} catch (e) {
	console.log(e);
}

cfg = cfg.map(elem => {
	elem.css = "";
	elem.js = "";

	let customizecssFile = path.join(directoryInject, elem.name, 'customize.css');
	try {
		elem.css = fs.readFileSync(customizecssFile, encoding);
	} catch (e) {
		console.log(e)
	}

	let customizejsFile = path.join(directoryInject, elem.name, 'customize.js');
	let loginjsFile = path.join(directoryInject, elem.name, 'login.js');

	let customizejs = "";
	try {
		customizejs = fs.readFileSync(customizejsFile, encoding);
	} catch (e) {
		console.log(e)
	}

	let loginjs = "";
	try {
		loginjs = fs.readFileSync(loginjsFile, encoding);
	} catch (e) {
		console.log(e)
	}

	let injectjs = templatejs.replace('%customizejs%', customizejs);
	elem.js = injectjs.replace('%loginjs%', loginjs);

	elem.patterns = elem.patterns.map(pattern => {
		pattern = matchPattern.parse(pattern);
		if (pattern === null) {
			console.log(`Bad pattern : ${pattern} in ${name}`);
		}
		return pattern;
	});
	return elem;
});

function glGetToInject(url) {
	for (let elem of cfg) {
		let patterns = elem.patterns;
		for (let pattern of patterns) {
			if (pattern.test(url)) {
				return {
					css: elem.css,
					js: elem.js
				};
			}
		}
	}
}

function glRefreshWebComponentSize() {
	let header = $('.tab-pane.active .gl-header');
	let webview = $('.tab-pane.active .gl-webview');
	if (header.length && webview.length) {
		let webviewsize = $(window).height() - header.offset().top - header.height();
		webview.height(webviewsize);
	}
}

window.onresize = function () {
	glRefreshWebComponentSize();
};

window.onload = function () {
	glRefreshWebComponentSize();
};

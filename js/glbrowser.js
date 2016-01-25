/* global window, $ */

'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const matchPattern = require('match-pattern');
const path = require('path');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

const directoryCfg = 'cfg';
const fileCfg = 'config.yml';
const encoding = 'utf-8';

let injectCSS = '';
let injectJS = '';
let webview = $('#main');
let cfg;

try {
	cfg = yaml.safeLoad(fs.readFileSync(fileCfg, encoding));
	cfg = cfg.map(elem => {
		let name = elem.name;
		elem.css = fs.readFileSync(path.join(directoryCfg, `${name}.css`), encoding);
		elem.js = fs.readFileSync(path.join(directoryCfg, `${name}.js`), encoding);

		elem.patterns = elem.patterns.map(pattern => {
			pattern = matchPattern.parse(pattern);
			if (pattern === null) {
				console.log(`Bad pattern : ${pattern} in ${name}`);
			}
			return pattern;
		});
		return elem;
	});
} catch (e) {
	console.log(e);
}

$('#refresh').click(function () {
	webview.get(0).reload();
});

$('#dev').click(function () {
	webview.get(0).openDevTools();
});

$('#goback').click(function () {
	webview.get(0).goBack();
});

$('#urltext').keypress(function (e) {
	if (e.keyCode !== 13) {
		return true;
	}

	let url = this.value;
	getToInject(url);
	webview.get(0).src = url;
	return false;
});

function getToInject(url) {
	injectCSS = '';
	injectJS = '';
	for (let elem of cfg) {
		let patterns = elem.patterns;
		for (let pattern of patterns) {
			if (pattern.test(url)) {
				injectCSS = elem.css;
				injectJS = elem.js;
				return;
			}
		}
	}
}

window.onresize = function () {
	let webviewsize = $(window).height() - $('#header').height();
	webview.height(webviewsize);
};

window.onload = function () {
	let indicator = $('#indicator');
	webview.on('did-start-loading', () => {
		indicator.text('loading...');
	});
	webview.on('did-stop-loading', () => {
		indicator.text('');
	});
	webview.on('did-finish-load', () => {
		webview.get(0).insertCSS(injectCSS);
		webview.get(0).executeJavaScript(injectJS);
	});
	window.onresize();
};

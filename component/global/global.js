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

const customizeClass = require('./component/customize/customize.js');
const customize = new customizeClass('./component/customize');

const autologinClass = require('./component/autologin/autologin.js');
const autologin = new autologinClass('./userdata/autologin.yml', './component/autologin');

const favoriteClass = require('./component/favorite/favorite.js');
const favoriteDb = new favoriteClass('./userdata/favorites.json');

window.$ = window.jQuery = require('jquery');
require('bootstrap');

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

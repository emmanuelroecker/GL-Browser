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

/* global window, $, glRefreshWebComponentSize */

'use strict';

class indexClass {
	constructor(cfgdirectory, userdirectory) {
		this._modPath = require('path');

		const customizeClass = require('customize/customize.js');
		global.customize = new customizeClass(cfgdirectory);

		const autologinClass = require('autologin/autologin.js');
		global.autologin = new autologinClass(cfgdirectory, this._modPath.join(userdirectory, 'autologin.yml'));

		const favoriteClass = require('favorite/favorite.js');
		global.favoriteDb = new favoriteClass(this._modPath.join(userdirectory, 'favorites.json'));

		window.$ = window.jQuery = require('jquery');
		require('bootstrap');

		global.riot = require('riot');

		global.glRefreshWebComponentSize = function () {
			let header = $('.tab-pane.active .gl-header');
			let webview = $('.tab-pane.active .gl-webview');
			if (header.length && webview.length) {
				let webviewsize = $(window).height() - header.offset().top - header.height();
				webview.height(webviewsize);
			}
		};

		window.onresize = function () {
			glRefreshWebComponentSize();
		};

		window.onload = function () {
			glRefreshWebComponentSize();
		};

		require('riot/autologin.js');
		require('riot/raw.js');
		require('riot/page.js');
		require('riot/tabs.js');
	}
}

module.exports = indexClass;

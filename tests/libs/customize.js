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
/* global describe, it */

'use strict';

const assert = require('assert');
const customizeClass = require('libs/customize/customize.js');
const crypt = new(require('libs/crypt/crypt.js'));

describe('customizeClass', function () {
	let customizeDataDir = './tests/data/customize';
	it('init bad directory', function () {
		assert.throws(function () {
			new customizeClass('./test/data/bad');
		}, Error);
	});
	it('compile patterns', function () {
		let customize = new customizeClass(customizeDataDir);
		let patterns = ['*://*.pinterest.com/*', '*://*.twitter.com/*', '*://www.google.fr/*'];
		let expected = [/^(http|https):\/\/[^\/]*?pinterest\.com(\/.*)?$/,
			/^(http|https):\/\/[^\/]*?twitter\.com(\/.*)?$/,
			/^(http|https):\/\/www\.google\.fr(\/.*)?$/
		];
		assert.deepEqual(expected, customize.compilePatterns(patterns));
	});
	it('get css', function () {
		let customize = new customizeClass(customizeDataDir);
		assert.equal('aAjwEAc3mD1Efc79B0gmtcRF7XaVDTJ2TsqCb5l6iMo=', crypt.hash(customize.getCSS('google')));
	});
	it('get js', function () {
		let customize = new customizeClass(customizeDataDir);
		assert.equal('5GCn8nXPelnOMQzr6LI1/t0iNyOvVnlPj56DOWyVdI4=', crypt.hash(customize.getJS('google')));
	});
	it('init', function () {
		let customize = new customizeClass(customizeDataDir);
		assert.equal('l7KvHCv0TwWHEdxH73C0ZGEfGnd6e0FaqdM4SNSNYR8=', crypt.hash(JSON.stringify(customize._customize)));
	});
	it('get to inject', function () {
		let customize = new customizeClass(customizeDataDir);
		let elem = customize.getToInject('http://www.google.com');
		assert.equal('aAjwEAc3mD1Efc79B0gmtcRF7XaVDTJ2TsqCb5l6iMo=', crypt.hash(elem.css));
		assert.equal('5GCn8nXPelnOMQzr6LI1/t0iNyOvVnlPj56DOWyVdI4=', crypt.hash(elem.js));
	});
});

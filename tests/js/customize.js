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
const customizeClass = require('customize/customize.js');
const crypt = new(require('crypt/crypt.js'));

describe('customizeClass', function () {
	let cfgdirectory = './app/cfg';
	it('compile patterns', function () {
		let customize = new customizeClass(cfgdirectory);
		let patterns = ['*://*.pinterest.com/*', '*://*.twitter.com/*', '*://www.google.fr/*'];
		let expected = [/^(http|https):\/\/[^\/]*?pinterest\.com(\/.*)?$/,
			/^(http|https):\/\/[^\/]*?twitter\.com(\/.*)?$/,
			/^(http|https):\/\/www\.google\.fr(\/.*)?$/
		];
		assert.deepEqual(expected, customize.compilePatterns(patterns));
	});
	it('get css', function () {
		let customize = new customizeClass(cfgdirectory);
		assert.equal('7fZH9pzfmQh3yQk1UXP7pWgUoYRXHjbbBuHKIltsyXY=', crypt.hash(customize.getCSS('google')));
	});
	it('get js', function () {
		let customize = new customizeClass(cfgdirectory);
		assert.equal('kPE+uaK3rjPu+gi3dNST7OgPRlXe1PrBCdq9qPiPBlI=', crypt.hash(customize.getJS('google')));
	});
	it('init', function () {
		let customize = new customizeClass(cfgdirectory);
		assert.equal('pOj6JM4aVQyD+Uj6Rhs7UATwZPB11cJEcHAZHDcZANo=', crypt.hash(JSON.stringify(customize._customize)));
	});
	it('get to inject', function () {
		let customize = new customizeClass(cfgdirectory);
		let elem = customize.getToInject('http://www.google.com');
		assert.equal('7fZH9pzfmQh3yQk1UXP7pWgUoYRXHjbbBuHKIltsyXY=', crypt.hash(elem.css));
		assert.equal('kPE+uaK3rjPu+gi3dNST7OgPRlXe1PrBCdq9qPiPBlI=', crypt.hash(elem.js));
	});
});

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

const autologinClass = require('../../component/autologin/autologin.js');
const assert = require('assert');
const crypt = new(require('../../component/crypt/crypt.js'));

describe('autologinClass', function () {
	it('init bad cfg filename', function () {
		assert.throws(function () {
			new autologinClass('./test/data/autologin/bad.yml', './test/data/customize');
		}, Error);
	});
	it('init bad directory', function () {
		assert.throws(function () {
			new autologinClass('./test/data/autologin/autologin.yml', './bad/bad');
		}, Error);
	});
	it('compile patterns', function () {
		let autologin = new autologinClass('./test/data/autologin/autologin.yml', './test/data/autologin');
		let patterns = ['*://*.twitter.com/*', '*://*.github.com/*'];
		let expected = [/^(http|https):\/\/[^\/]*?twitter\.com(\/.*)?$/,
			/^(http|https):\/\/[^\/]*?github\.com(\/.*)?$/
		];
		assert.deepEqual(expected, autologin.compilePatterns(patterns));
	});
	it('get js', function () {
		let autologin = new autologinClass('./test/data/autologin/autologin.yml', './test/data/autologin');
		assert.equal('p7MRebtDkSERaZeqedWd0t7wiaIyRilQfNXitilIkmI=', crypt.hash(autologin.getJS('github')));
	});
	it('init', function () {
		let autologin = new autologinClass('./test/data/autologin/autologin.yml', './test/data/autologin');
		assert.equal('8VGB7XGU+PMfQKjkOxJUwrZa0cUfbyUgtC51aed5koY=', crypt.hash(JSON.stringify(autologin._autologin)));
	});
	it('get to inject', function () {
		let autologin = new autologinClass('./test/data/autologin/autologin.yml', './test/data/autologin');
		let elem = autologin.getToInject('https://github.com/emmanuelroecker');
		assert.equal('p7MRebtDkSERaZeqedWd0t7wiaIyRilQfNXitilIkmI=', crypt.hash(elem.js));
	});
});

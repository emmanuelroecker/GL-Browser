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
const autologinClass = require('autologin/autologin.js');
const crypt = new(require('crypt/crypt.js'));

describe('autologinClass', function () {
	let autologinCfgFile = './tests/userdata/autologin.yml';

	it('init bad cfg filename', function () {
		assert.throws(function () {
			new autologinClass('./test/data/autologin/bad.yml');
		}, Error);
	});
	it('compile patterns', function () {
		let autologin = new autologinClass(autologinCfgFile);
		let patterns = ['*://*.twitter.com/*', '*://*.github.com/*'];
		let expected = [/^(http|https):\/\/[^\/]*?twitter\.com(\/.*)?$/,
			/^(http|https):\/\/[^\/]*?github\.com(\/.*)?$/
		];
		assert.deepEqual(expected, autologin.compilePatterns(patterns));
	});
	it('get js', function () {
		let autologin = new autologinClass(autologinCfgFile);
		assert.equal('t5hvd2hZAmnR+PV3vp8FVzUn1YgaHuD6Ujbm2PZ6JxE=', crypt.hash(autologin.getJS('github')));
	});
	it('init', function () {
		let autologin = new autologinClass(autologinCfgFile);
		assert.equal('MuFkHAYxRJyfYplgJhj7Ag6y0NA/GdRq7FbLdSqDm+8=', crypt.hash(JSON.stringify(autologin._autologin)));
	});
	it('masterpassword bad', function () {
		let autologin = new autologinClass(autologinCfgFile);
		assert.equal(false, autologin.setMasterPassword('test'));
	});
	it('masterpassword ok', function () {
		let autologin = new autologinClass(autologinCfgFile);
		assert.equal(true, autologin.setMasterPassword('masterpassword'));
	});
	it('get to inject', function () {
		let autologin = new autologinClass(autologinCfgFile);
		autologin.setMasterPassword('masterpassword');
		let elem = autologin.getToInject('https://github.com/emmanuelroecker');
		assert.equal('t5hvd2hZAmnR+PV3vp8FVzUn1YgaHuD6Ujbm2PZ6JxE=', crypt.hash(elem.js));
		assert.equal('username2', elem.user.login);
		assert.equal('password2', elem.user.password);
	});
});

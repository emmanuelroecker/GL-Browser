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
const autologinClass = require('libs/autologin/autologin.js');
const crypt = new(require('libs/crypt/crypt.js'));

describe('autologinClass', function () {
	let autologinDataCfgFile = './tests/data/autologin/autologin.yml';
	let autologinDataDir = './tests/data/autologin';

	it('init bad cfg filename', function () {
		assert.throws(function () {
			new autologinClass('./test/data/autologin/bad.yml', autologinDataDir);
		}, Error);
	});
	it('init bad directory', function () {
		assert.throws(function () {
			new autologinClass(autologinDataCfgFile, './bad/bad');
		}, Error);
	});
	it('compile patterns', function () {
		let autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		let patterns = ['*://*.twitter.com/*', '*://*.github.com/*'];
		let expected = [/^(http|https):\/\/[^\/]*?twitter\.com(\/.*)?$/,
			/^(http|https):\/\/[^\/]*?github\.com(\/.*)?$/
		];
		assert.deepEqual(expected, autologin.compilePatterns(patterns));
	});
	it('get js', function () {
		let autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		assert.equal('7dJsu6ROoW+RPCob+vQvf31EpySitL7x6XQK5WsmlIA=', crypt.hash(autologin.getJS('github')));
	});
	it('init', function () {
		let autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		assert.equal('cNEbJHgm5oeConY7Lm0QhJ3cMQG1nEldDU2zOS4Z21s=', crypt.hash(JSON.stringify(autologin._autologin)));
	});
	it('masterpassword bad', function() {
		let autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		assert.equal(false,autologin.setMasterPassword('test'));
	});
	it('masterpassword ok', function() {
		let autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		assert.equal(true,autologin.setMasterPassword('masterpassword'));
	});
	it('get to inject', function () {
		let autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		autologin.setMasterPassword('masterpassword');
		let elem = autologin.getToInject('https://github.com/emmanuelroecker');
		assert.equal('7dJsu6ROoW+RPCob+vQvf31EpySitL7x6XQK5WsmlIA=', crypt.hash(elem.js));
		assert.equal('username2',elem.user.login);
		assert.equal('password2',elem.user.password);
	});
});

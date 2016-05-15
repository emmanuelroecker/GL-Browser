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

const cryptClass = require('crypt/crypt.js');
const assert = require('assert');
const fs = require('fs');

describe('cryptClass', function () {
	it('hash string', function () {
		let crypt = new cryptClass();
		assert.equal('A6eLJscKw4eCn7o5CHaKTO/9lox5z+H+t78wjUnT8n4=', crypt.hash('masterpassword'));
	});
	it('hash file utf8', function () {
		let crypt = new cryptClass();
		let data = fs.readFileSync('./app/cfg/inject/customize/google/customize.css', 'utf8');
		assert.equal('7fZH9pzfmQh3yQk1UXP7pWgUoYRXHjbbBuHKIltsyXY=', crypt.hash(data));
	});
	it('encrypt', function () {
		let crypt = new cryptClass();
		let crypted = crypt.encrypt('username', 'masterpassword');
		assert.equal('1e43c2e88f1472d6', crypted);
	});
	it('decrypt', function () {
		let crypt = new cryptClass();
		let decrypted = crypt.decrypt('1e43c2e88f1472d6', 'masterpassword');
		assert.equal('username', decrypted);
	});
	it('encrypt and decrypt', function () {
		let crypt = new cryptClass();
		let crypted = crypt.encrypt('username', 'masterpassword');
		let decrypted = crypt.decrypt(crypted, 'masterpassword');
		assert.equal('username', decrypted);
	});
});

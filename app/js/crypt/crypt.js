/*
Copyright (C) 2016
Emmanuel ROECKER and Rym BOUCHAGOUR
http://dev.glicer.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

'use strict';

class cryptClass {
	constructor() {
		this._crypto = require('crypto');
		this._hashAlgorithm = 'sha256';
		this._cryptAlgorithm = 'aes-256-ctr';
		this._encoding = 'utf8';
		this._cryptEncoding = 'hex';
		this._hashEncoding = 'base64';
	}

	hash(data) {
		return this._crypto.createHash(this._hashAlgorithm).update(data,this._encoding).digest(this._hashEncoding);
	}

	encrypt(text, data) {
		let cipher = this._crypto.createCipher(this._cryptAlgorithm, data);
		let crypted = cipher.update(text, this._encoding, this._cryptEncoding);
		crypted += cipher.final(this._cryptEncoding);
		return crypted;
	}

	decrypt(text, data) {
		let decipher = this._crypto.createDecipher(this._cryptAlgorithm, data);
		let decrypted = decipher.update(text, this._cryptEncoding, this._encoding);
		decrypted += decipher.final(this._encoding);
		return decrypted;
	}
}

module.exports = cryptClass;

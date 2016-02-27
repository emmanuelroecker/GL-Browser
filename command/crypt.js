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

class glCryptClass {

	constructor() {
		 this._crypto = require('crypto');
	}

	encrypt(text,password) {
		let cipher = this._crypto.createCipher('aes-256-ctr', password)
		let crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex');
		return crypted;
	}

	decrypt(text, password) {
		let decipher = this._crypto.createDecipher('aes-256-ctr', password);
		let decrypted = decipher.update(text,'hex','utf8')
		decrypted += decipher.final('utf8');
		return decrypted;
	}
}

const program = require('commander');
program
	.version('0.0.1')
  .option('-t, --text [text]','text to encrypt')
	.option('-p, --password [password]', 'password used to encrypt')
	.parse(process.argv);

let crypt = new glCryptClass();
let crypted = crypt.encrypt(program.text,program.password);
console.log(crypted);

/*
let decrypted = crypt.decrypt(crypted, program.password);
console.log(decrypted);
*/

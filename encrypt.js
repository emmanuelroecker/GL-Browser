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

const crypto = require('crypto');
const program = require('commander');

program
	.version('0.0.1')
  .option('-t, --text [text]','text to encrypt')
	.option('-p, --password [password]', 'password used to encrypt')
	.parse(process.argv);

let cipher = crypto.createCipher('aes-256-ctr', program.password)
let crypted = cipher.update(program.text, 'utf8', 'hex')
crypted += cipher.final('hex');

console.log(crypted);

/*
let decipher = crypto.createDecipher('aes-256-ctr', program.password);
let decrypted = decipher.update(crypted,'hex','utf8')
decrypted += decipher.final('utf8');
console.log(decrypted);
*/

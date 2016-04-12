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

const crypt = require('../component/crypt/crypt.js');

const program = require('commander');
program
	.version('0.0.1')
  .option('-u, --username [username]','username to encrypt')
	.option('-p, --userpassword [userpassword]', 'user password to encrypt')
	.option('-P, --masterpassword [masterpassword]', 'masterpassword used to encrypt')
	.parse(process.argv);

let usernameCrypted = crypt.encrypt(program.username,program.masterpassword);
let userpasswordCrypted = crypt.encrypt(program.userpassword, program.masterpassword);
let masterpasswordHashed = crypt.hash(program.masterpassword);
console.log('Username Crypted: ' + usernameCrypted);
console.log('UserPassword Crypted: ' + userpasswordCrypted);
console.log('MasterPassword Hashed: ' + masterpasswordHashed);

/*
let decrypted = crypt.decrypt(crypted, program.password);
console.log(decrypted);
*/

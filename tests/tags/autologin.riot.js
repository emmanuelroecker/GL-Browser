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

/* global describe, it, document, before, beforeEach */

'use strict';

const assert = require('assert');
const fs = require('fs');
const riot = require('riot');
const event = new(require('libs/test/event.js'));
const autologinClass = require('libs/autologin/autologin.js');

describe('autologin riot', function () {
	let autologinRiotTagFile = './tags/autologin.riot.tag';
	let autologinDataCfgFile = './tests/data/autologin/autologin.yml';
	let autologinDataDir = './tests/data/autologin';
	before(function() {
		global.autologin = new autologinClass(autologinDataCfgFile, autologinDataDir);
		let autologinTag = fs.readFileSync(autologinRiotTagFile, 'utf8');
		eval(riot.compile(autologinTag));
	});
	beforeEach(function () {
		document.body.innerHTML = '';
	});
	it('mount', function () {
		let html = document.createElement('autologin');
		document.body.appendChild(html);
		let tag = riot.mount('autologin')[0];
		assert.equal(true, tag.isMounted);
	});
	it('autologin bad button', function (done) {
		let html = document.createElement('autologin');
		document.body.appendChild(html);
		riot.mount('autologin')[0];
		let passwordinput = document.querySelector('#password');
		passwordinput.focus();
		passwordinput.value = 'bas';
		let message = document.querySelector('#message');
		assert.equal('', message.textContent);
		setTimeout(function () {
			assert.equal('Bad password', message.textContent);
			done();
		}, 500);
		let button = document.querySelector('button');
		button.click();
	});
	it('autologin ok button', function (done) {
		let html = document.createElement('autologin');
		document.body.appendChild(html);
		riot.mount('autologin')[0];
		let passwordinput = document.querySelector('#password');
		passwordinput.focus();
		passwordinput.value = 'masterpassword';
		let icon = document.querySelector('#dropdownicon');
		assert.equal(true, icon.classList.contains('text-danger'));
		setTimeout(function () {
			assert.equal('', passwordinput.value);
			assert.equal(false, icon.classList.contains('text-danger'));
			done();
		}, 500);
		let button = document.querySelector('button');
		button.click();
	});
	it('autologin ok touch enter', function (done) {
		let html = document.createElement('autologin');
		document.body.appendChild(html);
		riot.mount('autologin')[0];
		let passwordinput = document.querySelector('#password');
		passwordinput.focus();
		passwordinput.value = 'masterpassword';
		let icon = document.querySelector('#dropdownicon');
		assert.equal(true, icon.classList.contains('text-danger'));
		setTimeout(function () {
			assert.equal('', passwordinput.value);
			assert.equal(false, icon.classList.contains('text-danger'));
			done();
		}, 500);
		event.triggerKeyboardEvent(passwordinput, 'keydown', 13);
	});
	it('autologin bad touch enter', function (done) {
		let html = document.createElement('autologin');
		document.body.appendChild(html);
		riot.mount('autologin')[0];
		let passwordinput = document.querySelector('#password');
		passwordinput.focus();
		passwordinput.value = 'bas';
		let message = document.querySelector('#message');
		assert.equal('', message.textContent);
		setTimeout(function () {
			assert.equal('Bad password', message.textContent);
			done();
		}, 500);
		event.triggerKeyboardEvent(passwordinput, 'keydown', 13);
	});
});

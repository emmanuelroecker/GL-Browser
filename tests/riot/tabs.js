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
const riot = require('riot');
require('main.js');

describe('tabs riot', () => {
	before(() => {
		require('riot/tabs.js');
	});
	beforeEach(() => {
		document.body.innerHTML = '';
	});
	it('mount', () => {
		let html = document.createElement('tabs');
		document.body.appendChild(html);
		let tag = riot.mount('tabs')[0];
		assert.equal(true, tag.isMounted);
	});
	it('add', () => {

	});
	it ('remove', () => {

	});
	it ('view', () => {

	});
});

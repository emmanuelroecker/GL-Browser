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

const favoriteClass = require('../components/favorite/favorite.js');
const program = require('commander');
program
	.version('0.0.1')
	.option('-s, --search [search]', 'text to search')
	.option('-d, --delete [delete]', 'delete object found')
	.option('-u, --url [url]', 'add url')
	.option('-t, --title [title]', 'add title')
	.parse(process.argv);

let favorite = new favoriteClass('./data/favorites.yml');

if (program.url && program.title) {
	console.log(`--- Add ${program.url} ${program.title} ---`);
	favorite.add(program.url, program.title);
	favorite.save();
}

if (program.search) {
	let words = program.search.replace(',', ' ');
	console.log(`--- Search ${words} ---`);
	let result = favorite.search(words);
	console.log(result);
}

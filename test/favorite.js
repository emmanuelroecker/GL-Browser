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

const favoriteClass = require('../components/favorite/favorite.js');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('favoriteClass', function () {
	describe('init read save', function () {
		it('normalize string null', function () {
			let favorite = new favoriteClass();
			assert.equal('', favorite.normalizeValue(null));
		});

		it('normalize string', function () {
			let favorite = new favoriteClass();
			assert.equal('aaa eeee ii oo uuu c oe \' aaaa ee ii c u o', favorite.normalizeValue('äâà éèëê ïî öô ùüû ç œ ’ ÁÃÅÂ ÈÊ ÌÎ Ç Ü Ô'));
		});

		it('new without filename', function () {
			let favorite = new favoriteClass();
			assert.deepEqual([], favorite._favorites);
		});

		it('new filename not exist', function () {
			let favorite = new favoriteClass('unknown.json');
			assert.deepEqual([], favorite._favorites);
		});

		it('load from file not exist', function () {
			let favorite = new favoriteClass();
			favorite.load('unknown.json');
			assert.deepEqual([], favorite._favorites);
		});

		it('load from file', function () {
			let favorite = new favoriteClass();
			favorite.load(path.join(__dirname, 'data/favorite/favorites.json'));
			assert.equal(9, favorite._favorites.length);
		});

		it('save in a file', function () {
			let favorite = new favoriteClass();
			favorite._favorites = [{
				'url': {
					'o': 'http://dev.glicer.com/',
					'n': 'http://dev.glicer.com/'
				},
				'title': {
					'o': 'Blog de développement web',
					'n': 'blog de developpement web'
				}
			}, {
				'url': {
					'o': 'http://dev.glicer.com/section/rym-bouchagour-emmanuel-roecker.html',
					'n': 'http://dev.glicer.com/section/rym-bouchagour-emmanuel-roecker.html'
				},
				'title': {
					'o': 'Emmanuel ROECKER & Rym BOUCHAGOUR - Blog de développement web',
					'n': 'emmanuel roecker & rym bouchagour - blog de developpement web'
				}
			}];
			favorite.save(path.join(__dirname, 'data/favorite/favorites.tmp.json'));
			assert.equal(447, fs.statSync(path.join(__dirname, 'data/favorite/favorites.tmp.json'))['size']);
		});

		it('add favorites', function () {
			let favorite = new favoriteClass();
			favorite.add('Url1', 'Page title1 éà');
			favorite.add('uRl2', 'pAge ç title2');

			let expected = [{
				'url': {
					'o': 'Url1',
					'n': 'url1'
				},
				'title': {
					'o': 'Page title1 éà',
					'n': 'page title1 ea'
				}
			}, {
				'url': {
					'o': 'uRl2',
					'n': 'url2'
				},
				'title': {
					'o': 'pAge ç title2',
					'n': 'page c title2'
				}
			}];
			assert.deepEqual(expected, favorite._favorites);
		});
	});
	describe('search', function () {
		it('normalize query', function () {
			let favorite = new favoriteClass();
			assert.deepEqual(['et', 'des', 'sciences', 'l\'universite'], favorite.normalizeQuery('L\'université des sciences et de l\'univers'));
		});

		it('highlight', function () {
			let favorite = new favoriteClass();

			let offsets = [{
				i: 3,
				p: 7
			}, {
				i: 23,
				p: 3
			}];
			assert.equal('je <b>préfère</b> une tarte à <b>une</b> pizza', favorite.highLight('je préfère une tarte à une pizza', offsets));
		});

		it('search', function () {
			let favorite = new favoriteClass(path.join(__dirname, 'data/favorite/favorites.json'));
			let result = favorite.search('dev navi');
			assert.equal('http://<b>dev</b>.glicer.com/section/probleme-solution/creer-<b>navi</b>gateur-personnalise.html', result[0].url.highlight);
			assert.equal('Créer un <b>navi</b>gateur personnalisé - Blog de <b>dév</b>eloppement web', result[0].title.highlight);
			assert.equal('http://dev.glicer.com/section/probleme-solution/creer-navigateur-personnalise.html', result[0].url.value.o);
			assert.equal('Créer un navigateur personnalisé - Blog de développement web', result[0].title.value.o);
		});
	});
});

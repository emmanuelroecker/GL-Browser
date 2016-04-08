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
'use strict';

let defaultDiacritics = [{
	base: 'a',
	characters: 'äâà'
}, {
	base: 'e',
	characters: 'éèëê'
}, {
	base: 'i',
	characters: 'ïî'
}, {
	base: 'o',
	characters: 'öô'
}, {
	base: 'u',
	characters: 'ùüû'
}, {
	base: 'c',
	characters: 'ç'
}, {
	base: 'oe',
	characters: 'œ'
}, {
	base: '\'',
	characters: '’'
}];

class favoriteClass {
	constructor(filename) {
		this._modFs = require('fs');
		this._filename = filename;
		this._encoding = 'utf8';

		this.diacriticsMap = [];
		for (let defaultDiacritic of defaultDiacritics) {
			let characters = defaultDiacritic.characters.split('');
			for (let character of characters) {
				this.diacriticsMap[character] = defaultDiacritic.base;
			}
		}

		try {
			this._favorites = JSON.parse(this._modFs.readFileSync(filename, this._encoding));
		} catch (e) {
			this._favorites = [];
		}
	}

	save() {
		this._modFs.writeFileSync(this._filename, JSON.stringify(this._favorites), this._encoding);
	}

	add(url, title) {
		let normalizeUrl = this.normalizeValue(url);
		let normalizeTitle = this.normalizeValue(title);
		this._favorites.push({
			url: {
				o: url,
				n: normalizeUrl
			},
			title: {
				o: title,
				n: normalizeTitle
			}
		});
	}

	searchPrefix(prefix, favorites) {
		let result = [];
		let prefixLength = prefix.length;
		let indexUrl = 0;
		let indexTitle = 0;
		for (let favorite of favorites) {
			indexUrl = favorite.url.value.n.indexOf(prefix);
			indexTitle = favorite.title.value.n.indexOf(prefix);

			if ((indexUrl >= 0) || (indexTitle >= 0)) {
				if (indexUrl >= 0) {
					favorite.url.offsets.push({
						i: indexUrl,
						p: prefixLength
					});
				}

				if (indexTitle >= 0) {
					favorite.title.offsets.push({
						i: indexTitle,
						p: prefixLength
					});
				}

				result.push(favorite);
			}
		}
		return result;
	}

	initSearchPrefix(prefix) {
		let result = [];
		let prefixLength = prefix.length;
		let indexUrl = 0;
		let indexTitle = 0;
		for (let favorite of this._favorites) {
			indexUrl = favorite.url.n.indexOf(prefix);
			indexTitle = favorite.title.n.indexOf(prefix);

			if ((indexUrl >= 0) || (indexTitle >= 0)) {
				let obj = {
					url: {
						value: favorite.url,
						highlight: '',
						offsets: []
					},
					title: {
						value: favorite.title,
						highlight: '',
						offsets: []
					}
				};

				if (indexUrl >= 0) {
					obj.url.offsets.push({
						i: indexUrl,
						p: prefixLength
					});
				}

				if (indexTitle >= 0) {
					obj.title.offsets.push({
						i: indexTitle,
						p: prefixLength
					});
				}

				result.push(obj);
			}
		}
		return result;
	}

	highLight(value, offsets) {
		let openTag = '<b>';
		let closeTag = '</b>';
		let lengthTag = openTag.length + closeTag.length;
		let totalLengthTag = 0;
		offsets.sort(function (a, b) {
			return a.i - b.i;
		});
		for (let offset of offsets) {
			let index = offset.i + totalLengthTag;
			let length = offset.p;
			value = value.substr(0, index) + openTag + value.substr(index, length) + closeTag + value.substr(index + length);
			totalLengthTag += lengthTag;
		}
		return value;
	}

	setHighlights(favorites) {
		for (let favorite of favorites) {
			favorite.url.highlight = this.highLight(favorite.url.value.o, favorite.url.offsets);
			favorite.title.highlight = this.highLight(favorite.title.value.o, favorite.title.offsets);
		}
	}

	normalizeValue(value) {
		if (!value)
			return '';
		let map = this.diacriticsMap;
		value = value.toLowerCase().replace(/[^\u0000-\u007E]/g, function (character) {
			return map[character] || character;
		});
		return value;
	}

	normalizeQuery(query) {
		let prefixes = this.normalizeValue(query).split(' ');
		//sort min length to max length
		prefixes.sort(function (a, b) {
			return a.length - b.length;
		});

		//remove duplicate start with same character
		let result = [];
		let length = prefixes.length;
		for (let i = 0; i < length; i++) {
			let word = prefixes[i];
			let ok = true;
			for (let j = i + 1; j < length; j++) {
				if (prefixes[j].indexOf(word) === 0) {
					ok = false;
					break;
				}
			}
			if (ok) {
				result.push(word);
			}
		}

		return result;
	}

	search(prefixes) {
		let prefixesList = this.normalizeQuery(prefixes);
		let favorites = this.initSearchPrefix(prefixesList[0]);
		prefixesList = prefixesList.slice(1);
		for (let prefix of prefixesList) {
			favorites = this.searchPrefix(prefix, favorites);
		}
		this.setHighlights(favorites);
		return favorites;
	}
}

module.exports = favoriteClass;

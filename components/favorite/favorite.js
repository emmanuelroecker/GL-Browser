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

class favoriteClass {
	constructor(filename) {
		this._modFs = require('fs');
		this._modPath = require('path');
		this._modYaml = require('js-yaml');
		this._filename = filename;
		this._encoding = 'utf8';
		try {
			this._favorites = this._modYaml.safeLoad(this._modFs.readFileSync(filename, this._encoding));
		} catch (e) {
			this._favorites = [];
		}
	}

	save() {
		this._modFs.writeFileSync(this._filename, this._modYaml.safeDump(this._favorites), this._encoding);
	}

	add(url, title) {
		this._favorites.push({
			url: url,
			title: title
		});
	}

	searchPrefix(prefix, favorites) {
		let result = [];
		let prefixLength = prefix.length;
		let indexUrl = 0;
		let indexTitle = 0;
		for (let favorite of favorites) {
			indexUrl = favorite.url.original.indexOf(prefix);
			indexTitle = favorite.title.original.indexOf(prefix);

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
			indexUrl = favorite.url.indexOf(prefix);
			indexTitle = favorite.title.indexOf(prefix);

			if ((indexUrl >= 0) || (indexTitle >= 0)) {
				let obj = {
					url: {
						original: favorite.url,
						highlight: '',
						offsets: []
					},
					title: {
						original: favorite.title,
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
			favorite.url.highlight = this.highLight(favorite.url.original, favorite.url.offsets);
			favorite.title.highlight = this.highLight(favorite.title.original, favorite.title.offsets);
		}
	}

	normalizeQuery(query) {
		let prefixes = query.split(' ');
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

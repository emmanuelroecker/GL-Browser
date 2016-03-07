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
/// <reference path="../../typings/main.d.ts" />
'use strict';
var sqlite3 = require("sqlite3");
var defaultDiacritics = [
    { base: 'a', characters: 'äâà' },
    { base: 'e', characters: 'éèëê' },
    { base: 'i', characters: 'ïî' },
    { base: 'o', characters: 'öô' },
    { base: 'u', characters: 'ùüû' },
    { base: 'c', characters: 'ç' },
    { base: 'oe', characters: 'œ' },
    { base: "'", characters: '’' }
];
var FullTextSearchClass = (function () {
    function FullTextSearchClass(filename, tableFilter, tableFullText, fields, minQueryLength) {
        if (minQueryLength === void 0) { minQueryLength = 2; }
        this.minQueryLength = 2;
        this.diacriticsMap = [];
        for (var i = 0; i < defaultDiacritics.length; i++) {
            var characters = defaultDiacritics[i].characters.split("");
            for (var j = 0; j < characters.length; j++) {
                this.diacriticsMap[characters[j]] = defaultDiacritics[i].base;
            }
        }
        this.minQueryLength = minQueryLength;
        this.db = new sqlite3.Database(filename);
        this.tableFilter = tableFilter;
        this.tableFullText = tableFullText;
        this.fields = fields;
    }
    FullTextSearchClass.prototype.removeDiacritics = function (sentence) {
        if (!sentence)
            return '';
        var map = this.diacriticsMap;
        sentence = sentence.toLowerCase().replace(/[^\u0000-\u007E]/g, function (a) {
            return map[a] || a;
        });
        return sentence;
    };
    FullTextSearchClass.prototype.toQuery = function (words) {
        var length = words.length;
        var result = "";
        var first = true;
        for (var i = 0; i < length; i++) {
            if (words[i].length > 1) {
                if (!first) {
                    result += " ";
                }
                result += words[i];
                if (words[i].indexOf(":") < 0) {
                    result += "*";
                }
                first = false;
            }
        }
        return result;
    };
    FullTextSearchClass.prototype.normalize = function (sentence) {
        if (!sentence)
            return [];
        sentence = this.removeDiacritics(sentence);
        var query = sentence.split(/[^a-z0-9:]+/i);
        query = query.filter(function (word) {
            return word.length > 1;
        });
        //sort min length to max length
        query.sort(function (a, b) {
            return a.length - b.length;
        });
        //remove duplicate start with same character
        var result = [];
        var length = query.length;
        for (var i = 0; i < length; i++) {
            var word = query[i];
            var ok = true;
            for (var j = i + 1; j < length; j++) {
                if (query[j].indexOf(word) === 0) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                result.push(word);
            }
        }
        return result;
    };
    /*
    query:string[] - liste des débuts de mots recherchés (['je','cherc','un','truc'])
    fields:string[] - liste de tous les champs de la table
  
    result.offsets is a text value containing a series of space-separated integers
  
    */
    FullTextSearchClass.prototype.highlights = function (query, fields, value, highlights) {
        var coords = highlights.split(/ /);
        var length = coords.length;
        var i = 0;
        var colnumInc = Array.apply(null, Array(fields.length)).map(function () {
            return 0;
        });
        var openTag = "<b>";
        var closeTag = "</b>";
        var lengthTag = openTag.length + closeTag.length; //longueur de <b></b> = 7
        while (i < length) {
            var colnum = coords[i++]; //The column number that the term instance occurs in (0 for the leftmost column of the FTS table, 1 for the next leftmost, etc.).
            var itemnum = coords[i++]; //The term number of the matching term within the full-text query expression. Terms within a query expression are numbered starting from 0 in the order that they occur.
            var offset = parseInt(coords[i++]) + colnumInc[colnum]; //The byte offset of the matching term within the column.
            var size = coords[i++]; //The size of the matching term in bytes.
            var valuefield = value[fields[colnum]]; //valeur du champs correspondant avant highlights
            var queryLength = query[itemnum].length; //The size of the matching term in bytes.
            value[fields[colnum]] = valuefield.substr(0, offset) + openTag + valuefield.substr(offset, queryLength) + closeTag + valuefield.substr(offset + queryLength); //remplace les champs en insérant les balises b
            colnumInc[colnum] += lengthTag;
        }
    };
    FullTextSearchClass.prototype.query = function (words, callbackEach, filter, hightlights) {
        if (filter === void 0) { filter = null; }
        if (hightlights === void 0) { hightlights = true; }
        if (words.length < this.minQueryLength) {
            return;
        }
        var query = this.normalize(words);
        var highlights = this.highlights;
        this.db.serialize(function () {
            var _this = this;
            var sql = "SELECT json,offsets FROM " + this.tableFilter + " JOIN\n      (SELECT docid, offsets(" + this.tableFullText + ") AS offsets\n       FROM " + this.tableFullText + " WHERE " + this.tableFullText + "\n       MATCH '" + this.toQuery(query) + "') USING (docid);";
            if (filter) {
                sql += " WHERE " + filter;
            }
            this.db.each(sql, function (err, row) {
                var obj = JSON.parse(row.json);
                _this.highlights(query, _this.fields, obj, row.offsets);
                callbackEach(err, obj);
            });
        });
    };
    return FullTextSearchClass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FullTextSearchClass;

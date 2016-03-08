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
var normalize_1 = require("./normalize");
var sqlite3 = require("sqlite3");
var IndexClass = (function () {
    function IndexClass(filename, table, fieldsFullText, fieldsFilter, minQueryLength) {
        if (minQueryLength === void 0) { minQueryLength = 2; }
        this.minQueryLength = 2;
        if (fieldsFullText.length <= 0) {
            throw new RangeError("You must have at least one field full text");
        }
        this.db = new sqlite3.Database(filename);
        this.normalize = new normalize_1.default();
        this.fieldsFilter = fieldsFilter;
        this.fieldsFullText = fieldsFullText;
        this.tableFilter = table + "F";
        this.tableFullText = table + "FT";
    }
    IndexClass.prototype.init = function () {
        var createSQLFilter = '';
        if (this.fieldsFilter) {
            var sqlfieldsFilter = this.fieldsFilter.join("','");
            createSQLFilter = "CREATE TABLE " + this.tableFilter + "(docid INTEGER PRIMARY KEY, json, '" + sqlfieldsFilter + "')";
        }
        else {
            createSQLFilter = "CREATE TABLE " + this.tableFilter + "(docid INTEGER PRIMARY KEY, json)";
        }
        var sqlfieldsFullText = this.fieldsFullText.join("','");
        var createSQLFullText = "CREATE VIRTUAL TABLE " + this.tableFullText + " USING fts4('" + sqlfieldsFullText + "');";
        var valuesFilter = Array(this.fieldsFilter.length).join(",");
        this.stmtInsertFilter = this.db.prepare("INSERT INTO " + this.tableFilter + " VALUES (?, ?, " + valuesFilter + ")");
        var valuesFullText = Array(this.fieldsFullText.length).join(",");
        this.stmtInsertFullText = this.db.prepare("INSERT INTO " + this.tableFullText + " (docid,'" + sqlfieldsFullText + "') VALUES (?," + valuesFullText + ")");
        this.db.serialize(function () {
            this.db.run(createSQLFilter);
            this.db.run(createSQLFullText);
        });
    };
    IndexClass.prototype.valuesFullText = function (obj) {
        var valuesFullText = [];
        for (var _i = 0, _a = this.fieldsFullText; _i < _a.length; _i++) {
            var fieldFullText = _a[_i];
            if (obj[fieldFullText]) {
                valuesFullText[fieldFullText] = this.normalize.normalize(obj[fieldFullText]);
            }
            else {
                valuesFullText[fieldFullText] = '';
            }
        }
        return valuesFullText;
    };
    IndexClass.prototype.valuesFilter = function (obj) {
        var valuesFilter = [];
        for (var _i = 0, _a = this.fieldsFilter; _i < _a.length; _i++) {
            var fieldFilter = _a[_i];
            if (obj[fieldFilter]) {
                valuesFilter[fieldFilter] = this.normalize.normalize(obj[fieldFilter]);
            }
            else {
                valuesFilter[fieldFilter] = '';
            }
        }
        return valuesFilter;
    };
    IndexClass.prototype.import = function (obj) {
        var valuesFullText = this.valuesFullText(obj);
        if (valuesFullText.length <= 0) {
            throw new RangeError("At least one full text field");
        }
        var valuesFilter = this.valuesFilter(obj);
        var json = JSON.stringify(obj);
        this.stmtInsertFilter.run(obj.id, json, valuesFilter);
        this.stmtInsertFilter.finalize();
        this.stmtInsertFullText.run(obj.id, valuesFullText);
    };
    /*
    query:string[] - liste des débuts de mots recherchés (['je','cherc','un','truc'])
    fields:string[] - liste de tous les champs de la table
  
    result.offsets is a text value containing a series of space-separated integers
  
    */
    IndexClass.prototype.highlights = function (query, fields, value, highlights) {
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
    IndexClass.prototype.query = function (words, callbackEach, filter, hightlights) {
        var _this = this;
        if (filter === void 0) { filter = null; }
        if (hightlights === void 0) { hightlights = true; }
        if (words.length < this.minQueryLength) {
            return;
        }
        var query = this.normalize.normalize(words);
        this.db.serialize(function () {
            var sql = "SELECT json,offsets FROM " + _this.tableFilter + " JOIN\n      (SELECT docid, offsets(" + _this.tableFullText + ") AS offsets\n       FROM " + _this.tableFullText + " WHERE " + _this.tableFullText + "\n       MATCH '" + _this.normalize.toQuery(query) + "') USING (docid);";
            if (filter) {
                sql += " WHERE " + filter;
            }
            _this.db.each(sql, function (err, row) {
                var obj = JSON.parse(row.json);
                _this.highlights(query, _this.fieldsFullText, obj, row.offsets);
                callbackEach(err, obj);
            });
        });
    };
    return IndexClass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexClass;

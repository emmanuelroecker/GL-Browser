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
var normalizefulltext_1 = require("./normalizefulltext");
var sqlite3 = require("sqlite3");
sqlite3.verbose();
var SearchFullTextClass = (function () {
    function SearchFullTextClass(filename, table, fieldsFullText, fieldsFilter, minQueryLength) {
        if (fieldsFilter === void 0) { fieldsFilter = null; }
        if (minQueryLength === void 0) { minQueryLength = 2; }
        this.valuesFilterSQL = null;
        this.minQueryLength = 2;
        if (fieldsFullText.length <= 0) {
            throw new RangeError("You must have at least one field full text");
        }
        this.db = new sqlite3.Database(filename);
        this.normalize = new normalizefulltext_1.default();
        this.fieldsFilter = fieldsFilter;
        this.fieldsFullText = fieldsFullText;
        this.tableFilter = table + "F";
        this.tableFullText = table + "FT";
    }
    SearchFullTextClass.prototype.init = function (done) {
        var _this = this;
        if (done === void 0) { done = null; }
        var createSQLFilter = '';
        if (this.fieldsFilter) {
            var sqlfieldsFilter = this.fieldsFilter.join("','");
            createSQLFilter = "CREATE TABLE " + this.tableFilter + "(docid INTEGER PRIMARY KEY, json, '" + sqlfieldsFilter + "')";
            var valuesFilter = (Array.apply(null, Array(this.fieldsFilter.length)).map(function () {
                return '?';
            })).join(",");
            this.valuesFilterSQL = "INSERT INTO " + this.tableFilter + " VALUES (?, ?, " + valuesFilter + ")";
        }
        else {
            createSQLFilter = "CREATE TABLE " + this.tableFilter + "(docid INTEGER PRIMARY KEY, json)";
            this.valuesFilterSQL = "INSERT INTO " + this.tableFilter + " VALUES (?, ?)";
        }
        var sqlfieldsFullText = this.fieldsFullText.join("','");
        var createSQLFullText = "CREATE VIRTUAL TABLE " + this.tableFullText + " USING fts4('" + sqlfieldsFullText + "');";
        var valuesFullText = (Array.apply(null, Array(this.fieldsFullText.length)).map(function () {
            return '?';
        })).join(",");
        this.valuesFullTextSQL = "INSERT INTO " + this.tableFullText + " (docid,'" + sqlfieldsFullText + "') VALUES (?," + valuesFullText + ")";
        this.db.serialize(function () {
            _this.db.run(createSQLFilter, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            _this.db.run(createSQLFullText, function (err) {
                if (err) {
                    console.log(err);
                }
                if (done) {
                    done();
                }
            });
        });
        return this;
    };
    SearchFullTextClass.prototype.close = function (done) {
        this.db.close(done);
    };
    SearchFullTextClass.prototype.clear = function (done) {
        var _this = this;
        this.db.serialize(function () {
            _this.db.run("DELETE * FROM " + _this.tableFilter);
            _this.db.run("DELETE * FROM " + _this.tableFullText, done);
        });
    };
    SearchFullTextClass.prototype.valuesFullText = function (obj) {
        var valuesFullText = [];
        valuesFullText.push(obj.id);
        for (var _i = 0, _a = this.fieldsFullText; _i < _a.length; _i++) {
            var fieldFullText = _a[_i];
            if (obj[fieldFullText]) {
                valuesFullText.push(this.normalize.normalizeImport(obj[fieldFullText]));
            }
            else {
                valuesFullText.push('');
            }
        }
        return valuesFullText;
    };
    SearchFullTextClass.prototype.valuesFilter = function (obj) {
        var valuesFilter = [];
        valuesFilter.push(obj.id);
        valuesFilter.push(JSON.stringify(obj));
        if (!this.fieldsFilter) {
            return valuesFilter;
        }
        for (var _i = 0, _a = this.fieldsFilter; _i < _a.length; _i++) {
            var fieldFilter = _a[_i];
            if (obj[fieldFilter]) {
                valuesFilter.push(obj[fieldFilter]);
            }
            else {
                valuesFilter.push(null);
            }
        }
        return valuesFilter;
    };
    SearchFullTextClass.prototype.importObjs = function (objs, done) {
        var _this = this;
        this.db.serialize(function () {
            _this.stmtInsertFilter = _this.db.prepare(_this.valuesFilterSQL, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            _this.stmtInsertFullText = _this.db.prepare(_this.valuesFullTextSQL, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            _this.db.parallelize(function () {
                for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
                    var obj = objs_1[_i];
                    _this.importObj(obj);
                }
            });
        });
        this.stmtInsertFilter.finalize();
        this.stmtInsertFullText.finalize(done);
    };
    SearchFullTextClass.prototype.importObj = function (obj) {
        var valuesFullText = this.valuesFullText(obj);
        if (Object.keys(valuesFullText).length <= 0) {
            throw new RangeError("At least one full text field");
        }
        this.stmtInsertFullText.run(valuesFullText, function (err) {
            if (err) {
                console.log(err);
            }
        });
        var valuesFilter = this.valuesFilter(obj);
        this.stmtInsertFilter.run(valuesFilter, function (err) {
            if (err) {
                console.log(err);
            }
        });
    };
    /*
    query:string[] - liste des débuts de mots recherchés (['je','cherc','un','truc'])
    fields:string[] - liste de tous les champs de la table
  
    result.offsets is a text value containing a series of space-separated integers
  
    */
    SearchFullTextClass.prototype.highlights = function (query, fields, value, highlights) {
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
    SearchFullTextClass.prototype.query = function (words, callbackEach, callbackComplete, filter) {
        var _this = this;
        if (filter === void 0) { filter = null; }
        if (words.length < this.minQueryLength) {
            return;
        }
        var query = this.normalize.normalizeQuery(words);
        this.db.serialize(function () {
            var sql = "SELECT json,offsets FROM " + _this.tableFilter + " JOIN\n      (SELECT docid, offsets(" + _this.tableFullText + ") AS offsets\n       FROM " + _this.tableFullText + " WHERE " + _this.tableFullText + "\n       MATCH '" + _this.normalize.toQuery(query) + "') USING (docid)";
            if ((filter) && (_this.fieldsFilter)) {
                sql += " WHERE " + filter;
            }
            var objs = [];
            _this.db.each(sql, function (err, row) {
                var objOriginal = JSON.parse(row.json);
                var objHighlights = JSON.parse(row.json); //TODO: use object assign to clone
                _this.highlights(query, _this.fieldsFullText, objHighlights, row.offsets);
                objs.push({ highlights: objHighlights, original: objOriginal });
                callbackEach(err, objOriginal, objHighlights);
            }, function (err, rows) {
                callbackComplete(err, objs);
            });
        });
    };
    return SearchFullTextClass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchFullTextClass;

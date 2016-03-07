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
var IndexClass = (function () {
    function IndexClass(filename, table, fieldsFullText, fieldsFilter) {
        if (fieldsFullText.length <= 0) {
            throw new RangeError("You must have at least one field full text");
        }
        this.fieldsFilter = fieldsFilter;
        this.fieldsFullText = fieldsFullText;
        this.tableFilter = table + "F";
        this.tableFullText = table + "FT";
        var createSQLFilter = '';
        if (fieldsFilter) {
            var sqlfieldsFilter = fieldsFilter.join("','");
            createSQLFilter = "CREATE TABLE " + this.tableFilter + "(docid INTEGER PRIMARY KEY, json, '" + sqlfieldsFilter + "')";
        }
        else {
            createSQLFilter = "CREATE TABLE " + this.tableFilter + "(docid INTEGER PRIMARY KEY, json)";
        }
        var sqlfieldsFullText = fieldsFullText.join("','");
        var createSQLFullText = "CREATE VIRTUAL TABLE " + this.tableFullText + " USING fts4('" + sqlfieldsFullText + "');";
        var valuesFilter = Array(fieldsFilter.length).join(",");
        this.stmtInsertFilter = this.db.prepare("INSERT INTO " + this.tableFilter + " VALUES (?, ?, " + valuesFilter + ")");
        var valuesFullText = Array(fieldsFullText.length).join(",");
        this.stmtInsertFullText = this.db.prepare("INSERT INTO " + this.tableFullText + " (docid,'" + sqlfieldsFullText + "') VALUES (?," + valuesFullText + ")");
        this.db = new sqlite3.Database(filename);
        this.db.serialize(function () {
            this.db.run(createSQLFilter);
            this.db.run(createSQLFullText);
        });
    }
    IndexClass.prototype.valuesFullText = function (obj) {
        var valuesFullText = [];
        for (var _i = 0, _a = this.fieldsFullText; _i < _a.length; _i++) {
            var fieldFullText = _a[_i];
            if (obj[fieldFullText]) {
                valuesFullText[fieldFullText] = this.normalize(obj[fieldFullText]);
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
                valuesFilter[fieldFilter] = this.normalize(obj[fieldFilter]);
            }
            else {
                valuesFilter[fieldFilter] = '';
            }
        }
        return valuesFilter;
    };
    IndexClass.prototype.import = function (obj) {
        var valuesFullText = this.valuesFullText(obj);
        var valuesFilter = this.valuesFilter(obj);
    };
    return IndexClass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexClass;

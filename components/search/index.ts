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

import * as sqlite3 from "sqlite3";

export default class IndexClass {
  private tableFilter: string;
  private tableFullText: string;
  private fields: string[];
  private fieldsFilter:string[];
  private fieldsFullText:string[];
  private db: sqlite3.Database;
  private stmtInsertFilter: sqlite3.Statement;
  private stmtInsertFullText: sqlite3.Statement;

  constructor(filename: string, table: string, fieldsFullText: string[], fieldsFilter: string[]) {

    if (fieldsFullText.length <= 0) {
      throw new RangeError("You must have at least one field full text");
    }

    this.fieldsFilter = fieldsFilter;
    this.fieldsFullText = fieldsFullText;
    this.tableFilter = `${table}F`;
    this.tableFullText = `${table}FT`;

    let createSQLFilter = '';
    if (fieldsFilter) {
      let sqlfieldsFilter = fieldsFilter.join("','");
      createSQLFilter = `CREATE TABLE ${this.tableFilter}(docid INTEGER PRIMARY KEY, json, '${sqlfieldsFilter}')`;
    } else {
      createSQLFilter = `CREATE TABLE ${this.tableFilter}(docid INTEGER PRIMARY KEY, json)`;
    }

    let sqlfieldsFullText = fieldsFullText.join("','");
    let createSQLFullText = `CREATE VIRTUAL TABLE ${this.tableFullText} USING fts4('${sqlfieldsFullText}');`;

    let valuesFilter = Array(fieldsFilter.length).join(",");
    this.stmtInsertFilter = this.db.prepare(`INSERT INTO ${this.tableFilter} VALUES (?, ?, ${valuesFilter})`);

    let valuesFullText = Array(fieldsFullText.length).join(",");
    this.stmtInsertFullText = this.db.prepare(`INSERT INTO ${this.tableFullText} (docid,'${sqlfieldsFullText}') VALUES (?,${valuesFullText})`);

    this.db = new sqlite3.Database(filename);
    this.db.serialize(function() {
      this.db.run(createSQLFilter);
      this.db.run(createSQLFullText);
    });
  }

  private valuesFullText(obj:any):string[] {
    let valuesFullText = [];
    for (let fieldFullText of this.fieldsFullText) {
      if (obj[fieldFullText]) {
        valuesFullText[fieldFullText] = this.normalize(obj[fieldFullText]);
      } else {
        valuesFullText[fieldFullText] = '';
      }
    }

    return valuesFullText;
  }

  private valuesFilter(obj:any):string[] {
    let valuesFilter = [];
    for (let fieldFilter of this.fieldsFilter) {
      if (obj[fieldFilter]) {
        valuesFilter[fieldFilter] = this.normalize(obj[fieldFilter]);
      } else {
        valuesFilter[fieldFilter] = '';
      }
    }
    return valuesFilter;
  }

  public import(obj:any) {
    let valuesFullText:string[] = this.valuesFullText(obj);
    let valuesFilter:string[]   = this.valuesFilter(obj);
  }
}

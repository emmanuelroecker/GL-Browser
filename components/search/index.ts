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

import NormalizeClass from "./normalize";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import * as sqlite3 from "sqlite3";
sqlite3.verbose();

export default class IndexClass {
  private tableFilter: string;
  private tableFullText: string;
  private fields: string[];
  private fieldsFilter: string[];
  private fieldsFullText: string[];
  private valuesFilterSQL: string;
  private valuesFullTextSQL: string;
  private normalize: NormalizeClass;
  private db: sqlite3.Database;
  private stmtInsertFilter: sqlite3.Statement;
  private stmtInsertFullText: sqlite3.Statement;
  private minQueryLength: number = 2;

  constructor(filename: string, table: string, fieldsFullText: string[], fieldsFilter: string[], minQueryLength: number = 2) {
    if (fieldsFullText.length <= 0) {
      throw new RangeError("You must have at least one field full text");
    }
    this.db = new sqlite3.Database(filename);
    this.normalize = new NormalizeClass();
    this.fieldsFilter = fieldsFilter;
    this.fieldsFullText = fieldsFullText;
    this.tableFilter = `${table}F`;
    this.tableFullText = `${table}FT`;
  }

  public init(done: () => void) {
    let createSQLFilter = '';
    if (this.fieldsFilter) {
      let sqlfieldsFilter = this.fieldsFilter.join("','");
      createSQLFilter = `CREATE TABLE ${this.tableFilter}(docid INTEGER PRIMARY KEY, json, '${sqlfieldsFilter}')`;
    } else {
      createSQLFilter = `CREATE TABLE ${this.tableFilter}(docid INTEGER PRIMARY KEY, json)`;
    }

    let sqlfieldsFullText = this.fieldsFullText.join("','");
    let createSQLFullText = `CREATE VIRTUAL TABLE ${this.tableFullText} USING fts4('${sqlfieldsFullText}');`;

    let valuesFilter = (Array.apply(null, Array(this.fieldsFilter.length)).map(function() {
      return '?'
    })).join(",");
    this.valuesFilterSQL = `INSERT INTO ${this.tableFilter} VALUES (?, ?, ${valuesFilter})`;
    let valuesFullText = (Array.apply(null, Array(this.fieldsFullText.length)).map(function() {
      return '?'
    })).join(",");
    this.valuesFullTextSQL = `INSERT INTO ${this.tableFullText} (docid,'${sqlfieldsFullText}') VALUES (?,${valuesFullText})`;

    this.db.serialize(() => {
      this.db.run(createSQLFilter, function(err: Error) {
        if (err) {
          console.log(err);
        }
      });
      this.db.run(createSQLFullText, function(err: Error) {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  }

  public close(done: () => void) {
    this.db.close(done);
  }

  public clear(done: () => void) {
    this.db.serialize(() => {
      this.db.run(`DELETE * FROM ${this.tableFilter}`);
      this.db.run(`DELETE * FROM ${this.tableFullText}`, done);
    });
  }

  private valuesFullText(obj: any): string[] {
    let valuesFullText = [];
    valuesFullText.push(obj.id);
    for (let fieldFullText of this.fieldsFullText) {
      if (obj[fieldFullText]) {
        valuesFullText.push(this.normalize.normalizeImport(obj[fieldFullText]));
      } else {
        valuesFullText.push('');
      }
    }
    return valuesFullText;
  }

  private valuesFilter(obj: any): string[] {
    let valuesFilter = [];
    valuesFilter.push(obj.id);
    valuesFilter.push(JSON.stringify(obj));
    for (let fieldFilter of this.fieldsFilter) {
      if (obj[fieldFilter]) {
        valuesFilter.push(obj[fieldFilter]);
      } else {
        valuesFilter.push(null);
      }
    }
    return valuesFilter;
  }

  public importYaml(filename: string, done: () => void) {
    this.stmtInsertFilter = this.db.prepare(this.valuesFilterSQL, (err: Error) => {
      if (err) {
        console.log(err);
      }
      this.stmtInsertFullText = this.db.prepare(this.valuesFullTextSQL, (err: Error) => {
        if (err) {
          console.log(err);
        }
        let objs = yaml.safeLoad(fs.readFileSync(filename, "utf8"));
        for (let obj of objs) {
          this.import(obj);
        }
        this.stmtInsertFilter.finalize();
        this.stmtInsertFullText.finalize(done);
      });
    });
  }

  public import(obj: any) {
    let valuesFullText: string[] = this.valuesFullText(obj);

    if (Object.keys(valuesFullText).length <= 0) {
      throw new RangeError("At least one full text field");
    }

    let valuesFilter: string[] = this.valuesFilter(obj);
    this.stmtInsertFilter.run(valuesFilter, function(err: Error) {
      if (err) {
        console.log(err);
      }
    });

    this.stmtInsertFullText.run(valuesFullText, function(err: Error) {
      if (err) {
        console.log(err);
      }
    });
  }

  /*
  query:string[] - liste des débuts de mots recherchés (['je','cherc','un','truc'])
  fields:string[] - liste de tous les champs de la table

  result.offsets is a text value containing a series of space-separated integers

  */
  public highlights(query: string[], fields: string[], value: any, highlights: string) {
    let coords = highlights.split(/ /);
    let length = coords.length;

    let i: number = 0;

    let colnumInc = Array.apply(null, Array(fields.length)).map(function() { //créer un tableau du nombre de fields avec valeur 0
      return 0
    });
    let openTag = "<b>";
    let closeTag = "</b>";
    let lengthTag = openTag.length + closeTag.length; //longueur de <b></b> = 7
    while (i < length) {
      let colnum = coords[i++]; //The column number that the term instance occurs in (0 for the leftmost column of the FTS table, 1 for the next leftmost, etc.).
      let itemnum = coords[i++]; //The term number of the matching term within the full-text query expression. Terms within a query expression are numbered starting from 0 in the order that they occur.
      let offset = parseInt(coords[i++]) + colnumInc[colnum]; //The byte offset of the matching term within the column.
      let size = coords[i++]; //The size of the matching term in bytes.

      let valuefield = value[fields[colnum]]; //valeur du champs correspondant avant highlights
      let queryLength = query[itemnum].length; //The size of the matching term in bytes.

      value[fields[colnum]] = valuefield.substr(0, offset) + openTag + valuefield.substr(offset, queryLength) + closeTag + valuefield.substr(offset + queryLength); //remplace les champs en insérant les balises b
      colnumInc[colnum] += lengthTag;
    }
  }

  public query(words: string, callbackEach: (err: any, obj: any) => void, callbackComplete: (err: any, objs: any) => void, filter: string = null, hightlights: boolean = true) {
    if (words.length < this.minQueryLength) {
      return;
    }

    let query: string[] = this.normalize.normalizeQuery(words);
    this.db.serialize(() => {
      let sql = `SELECT json,offsets FROM ${this.tableFilter} JOIN
      (SELECT docid, offsets(${this.tableFullText}) AS offsets
       FROM ${this.tableFullText} WHERE ${this.tableFullText}
       MATCH '${this.normalize.toQuery(query) }') USING (docid)`;

      if (filter) {
        sql += ` WHERE ${filter}`;
      }

      let objs = [];
      this.db.each(sql, (err: any, row: any) => {
        let obj = JSON.parse(row.json);
        this.highlights(query, this.fieldsFullText, obj, row.offsets);
        objs.push(obj);
        callbackEach(err, obj);
      }, (err: any, rows: number) => {
          callbackComplete(err, objs);
        });
    });
  }
}

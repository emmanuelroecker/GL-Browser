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

interface Diacritics {
  base: string;
  characters: string;
}

interface Response {
  fields: string[];
  results: any[];
}

let defaultDiacritics: Diacritics[] = [
  { base: 'a', characters: 'äâà' },
  { base: 'e', characters: 'éèëê' },
  { base: 'i', characters: 'ïî' },
  { base: 'o', characters: 'öô' },
  { base: 'u', characters: 'ùüû' },
  { base: 'c', characters: 'ç' },
  { base: 'oe', characters: 'œ' },
  { base: "'", characters: '’' }
];

export default class FullTextSearchClass {
  private minQueryLength: number = 2;
  private diacriticsMap: string[] = [];
  private tableFilter: string;
  private tableFullText: string;
  private fields: string[];
  private db:sqlite3.Database;

  constructor(filename: string, tableFilter: string, tableFullText: string, fields: string[], minQueryLength: number = 2) {
    for (let i = 0; i < defaultDiacritics.length; i++) {
      let characters = defaultDiacritics[i].characters.split("");
      for (let j = 0; j < characters.length; j++) {
        this.diacriticsMap[characters[j]] = defaultDiacritics[i].base;
      }
    }

    this.minQueryLength = minQueryLength;
    this.db = new sqlite3.Database(filename);
    this.tableFilter = tableFilter;
    this.tableFullText = tableFullText;
    this.fields = fields;
  }

  private removeDiacritics(sentence: string): string {
    if (!sentence)
      return '';
    let map = this.diacriticsMap;
    sentence = sentence.toLowerCase().replace(/[^\u0000-\u007E]/g, function(a) {
      return map[a] || a;
    });
    return sentence;
  }

  public toQuery(words: string[]): string {
    let length: number = words.length;
    let result: string = "";
    let first: boolean = true;
    for (let i = 0; i < length; i++) {
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
  }

  public normalize(sentence: string): string[] {
    if (!sentence)
      return [];
    sentence = this.removeDiacritics(sentence);
    let query = sentence.split(/[^a-z0-9:]+/i);

    query = query.filter(function(word) {
      return word.length > 1;
    });


    //sort min length to max length
    query.sort(function(a, b) {
      return a.length - b.length;
    });

    //remove duplicate start with same character
    let result: string[] = [];
    let length = query.length;
    for (let i = 0; i < length; i++) {
      let word = query[i];
      let ok = true;
      for (let j = i + 1; j < length; j++) {
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

  public query(words: string, callbackEach: (err: any, obj: any) => void, filter: string = null, hightlights: boolean = true) {
    if (words.length < this.minQueryLength) {
      return;
    }

    let query: string[] = this.normalize(words);
    let highlights = this.highlights;

    this.db.serialize(function() {
      let sql = `SELECT json,offsets FROM ${this.tableFilter} JOIN
      (SELECT docid, offsets(${this.tableFullText}) AS offsets
       FROM ${this.tableFullText} WHERE ${this.tableFullText}
       MATCH '${this.toQuery(query) }') USING (docid);`;

      if (filter) {
        sql += ` WHERE ${filter}`;
      }

      this.db.each(sql, (err: any, row: any) => {
        let obj = JSON.parse(row.json);
        this.highlights(query, this.fields, obj, row.offsets);
        callbackEach(err, obj);
      });
    });
  }
}

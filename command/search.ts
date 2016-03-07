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

  constructor(minQueryLength: number = 2) {
    for (let i = 0; i < defaultDiacritics.length; i++) {
      let characters = defaultDiacritics[i].characters.split("");
      for (let j = 0; j < characters.length; j++) {
        this.diacriticsMap[characters[j]] = defaultDiacritics[i].base;
      }
    }

    this.minQueryLength = minQueryLength;
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

  public highlights(query: string[], fields: string[], result) {
    let coords = result.highlights.split(/ /);
    let length = coords.length;

    let i: number = 0;

    let colnumInc = Array.apply(null, Array(fields.length)).map(function() {
      return 0
    });
    while (i < length) {
      let colnum = coords[i++];
      let itemnum = coords[i++];
      let offset = parseInt(coords[i++]) + colnumInc[colnum];
      let size = coords[i++];

      let value = result.value[fields[colnum]];
      let queryLength = query[itemnum].length;

      result.value[fields[colnum]] = value.substr(0, offset) + "<b>" + value.substr(offset, queryLength) + "</b>" + value.substr(offset + queryLength);
      colnumInc[colnum] += 7;
    }
  }

  private httpGet(url: string, callback: (response: Response) => void) {
    let anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
        callback(JSON.parse(anHttpRequest.responseText));
      }
    };

    anHttpRequest.open("GET", url, true);
    anHttpRequest.send(null);
  }

  public query(words: string, callbackEach: (value: any) => void, callbackEnd: (values: any[]) => void, filter: string = null, hightlights: boolean = true) {
    if (words.length < this.minQueryLength) {
      callbackEnd(null);
      return;
    }

    let query: string[] = this.normalize(words);
    let highlights = this.highlights;

    if (!filter) {
      filter = '';
    }

    /*
    var url = this.urlServer.replace('{q}', this.toQuery(query));
    url = url.replace('{f}', filter);
    this.httpGet(url, function(data: Response) {
      let fields: string[] = data.fields;
      let results = data.results;
      results.forEach(function(result) {
        if (hightlights) {
          highlights(query, fields, result);
        }
        callbackEach(result.value);
      });
      callbackEnd(results);
    });
    */
  }
}

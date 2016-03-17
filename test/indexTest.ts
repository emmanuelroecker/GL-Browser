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

/// <reference path="../typings/main.d.ts" />

'use strict';

import IndexClass from '../components/search/index';
import * as fs from "fs";
import * as path from "path";
import * as should from 'should';
let persist = should;

describe('IndexClass', () => {
  let db = null;

  beforeEach(function(done) {
    let dbfile = path.join(__dirname, 'data', 'test.db');
    let dbdata1 = path.join(__dirname, 'data', 'web.yml');
    let dbdata2 = path.join(__dirname, 'data', 'web2.yml');
    try {
      fs.unlinkSync(dbfile);
    } catch (e) {
    }
    db = new IndexClass(dbfile, "test", ['title', 'tags', 'description', 'address', 'city'], ['gps']);
    db.init(function() {
      db.importYaml(dbdata1, function() {
        db.importYaml(dbdata2, done);
      });
    });
  });

  afterEach(function(done) {
    db.close(done);
  });

  describe('#highlights', () => {
    it('test1', () => {
      let value = { field1: "j'aime le word1", field2: "je préfère le word25 qui est meilleur" };
      let highlights = '0 0 10 5 1 1 14 6';

      db.highlights(["word1", "word2"], ["field1", "field2"], value, highlights);

      value.field1.should.equal("j'aime le <b>word1</b>");
      value.field2.should.equal("je préfère le <b>word2</b>5 qui est meilleur");
    });
  });

  describe("#search", () => {
    it('search1', () => {
       db.query('rest* chaponnay', (err:any,obj:any) => {}, (err:any,objs:any) => {
          objs[0].title.should.containEql("Aklé");
       });
    });


    it('search2', () => {
      db.query('zol*', (err:any,obj:any) => {}, (err:any, objs:any) => {
        objs[0].title.should.equal("Le <b>Zol</b>a");
      });
    });


    it('search3', () => {
      db.query('lyon', (err:any,obj:any) => {}, (err:any,objs:any) => {
        objs[0].title.should.equal("Gym Suédoise <b>Lyon</b>");
      },'gps IS NULL');
    })


    it('search4', () => {
      db.query('tags:cinema', (err:any,obj:any) => {}, (err:any,objs:any) => {
         objs.length.should.equal(2);
         objs[0].title.should.equal("Cinéma Comoedia");
         objs[1].title.should.equal("Le Zola");
      });
    })

    it('search5', () => {
      db.query('l\'ame soeur', (err:any,obj:any) => {}, (err:any,objs:any) => {
        objs.length.should.equal(1);
      });
    })
  });
});

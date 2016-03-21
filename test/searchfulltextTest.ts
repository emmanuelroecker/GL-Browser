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

import SearchFullTextClass from '../components/searchfulltext/searchfulltext';
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import * as should from 'should';
let persist = should;

describe('SearchFullTextClass Favorites', () => {
  let db: SearchFullTextClass = null;

  beforeEach(function(done) {
    let dbfile = path.join(__dirname, 'data', 'favorites', 'test2.db');
    try {
      fs.unlinkSync(dbfile);
    } catch (e) {
    }
    db = new SearchFullTextClass(dbfile, "test", ['title', 'url']).init(done);
  });

  afterEach(function(done) {
    db.close(done);
  });

  describe('#search', () => {
    it('test1', () => {
      let objs = [{ title: "Blog de développement Web", url: "http://dev.glicer.com" }];
      db.importObjs(objs, () => {
        db.query('dev', (err: any, obj: any) => { }, (err: any, objs: any) => {
          objs[0].highlights.title.should.equal("Blog de <b>dév</b>eloppement Web");
          objs[0].highlights.url.should.equal("http://<b>dev</b>.glicer.com");
        })
      });
    })
  });
});

describe('SearchFullTextClass Favorites PreData', () => {
  let db: SearchFullTextClass = null;

  beforeEach(function(done) {
    let dbfile = path.join(__dirname, 'data', 'favorites', 'test.db');
    let dbdata = path.join(__dirname, 'data', 'favorites', 'favorites.yml');
    try {
      fs.unlinkSync(dbfile);
    } catch (e) {
    }
    db = new SearchFullTextClass(dbfile, "test", ['title', 'url']);
    db.init(function() {
      let objs = yaml.safeLoad(fs.readFileSync(dbdata, "utf8"));
      db.importObjs(objs, done);
    });
  });

  afterEach(function(done) {
    db.close(done);
  });

  describe('#search', () => {
    it('test1', () => {
      db.query('dev', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs[0].highlights.title.should.equal("Blog de <b>dév</b>eloppement web");
        objs[0].highlights.url.should.equal("http://<b>dev</b>.glicer.com");
      });
    })

    it('test2', () => {
      db.query('glicer', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs[0].highlights.url.should.equal("http://dev.<b>glicer</b>.com");
        objs[1].highlights.url.should.equal("http://lyon.<b>glicer</b>.com");
      });
    });
  });
});

describe('SearchFullTextClass Lyon', () => {
  let db: SearchFullTextClass = null;

  beforeEach(function(done) {
    let dbfile = path.join(__dirname, 'data', 'lyon', 'test.db');
    let dbdata1 = path.join(__dirname, 'data', 'lyon', 'web.yml');
    let dbdata2 = path.join(__dirname, 'data', 'lyon', 'web2.yml');
    try {
      fs.unlinkSync(dbfile);
    } catch (e) {
    }
    db = new SearchFullTextClass(dbfile, "test", ['title', 'tags', 'description', 'address', 'city'], ['gps']);
    db.init(function() {
      let objs = yaml.safeLoad(fs.readFileSync(dbdata1, "utf8"));
      db.importObjs(objs, function() {
        let objs = yaml.safeLoad(fs.readFileSync(dbdata2, "utf8"));
        db.importObjs(objs, done);
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
      db.query('rest chaponnay', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs[0].highlights.title.should.containEql("Aklé");
        objs[0].highlights.tags.should.equal("<b>rest</b>aurant libanais monde");
        objs[0].highlights.address.should.equal("108 rue <b>Chaponnay</b>");
      });
    });


    it('search2', () => {
      db.query('zol', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs[0].highlights.title.should.equal("Le <b>Zol</b>a");
      });
    });


    it('search3', () => {
      db.query('lyon', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs[0].highlights.title.should.equal("Gym Suédoise <b>Lyon</b>");
      }, 'gps IS NULL');
    })


    it('search4', () => {
      db.query('tags:cinema', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs.length.should.equal(2);
        objs[0].highlights.title.should.equal("Cinéma Comoedia");
        objs[1].highlights.title.should.equal("Le Zola");
      });
    })

    it('search5', () => {
      db.query('l\'ame soeur', (err: any, obj: any) => { }, (err: any, objs: any) => {
        objs.length.should.equal(1);
        objs[0].highlights.title.should.equal("L’<b>Âme</b> <b>Sœur</b>");
      });
    })
  });
});

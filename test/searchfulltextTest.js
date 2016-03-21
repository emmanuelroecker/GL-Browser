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
var searchfulltext_1 = require('../components/searchfulltext/searchfulltext');
var yaml = require("js-yaml");
var fs = require("fs");
var path = require("path");
var should = require('should');
var persist = should;
describe('SearchFullTextClass Favorites', function () {
    var db = null;
    beforeEach(function (done) {
        var dbfile = path.join(__dirname, 'data', 'favorites', 'test2.db');
        try {
            fs.unlinkSync(dbfile);
        }
        catch (e) {
        }
        db = new searchfulltext_1.default(dbfile, "test", ['title', 'url']).init(done);
    });
    afterEach(function (done) {
        db.close(done);
    });
    describe('#search', function () {
        it('test1', function () {
            var objs = [{ title: "Blog de développement Web", url: "http://dev.glicer.com" }];
            db.importObjs(objs, function () {
                db.query('dev', function (err, obj) { }, function (err, objs) {
                    objs[0].highlights.title.should.equal("Blog de <b>dév</b>eloppement Web");
                    objs[0].highlights.url.should.equal("http://<b>dev</b>.glicer.com");
                });
            });
        });
    });
});
describe('SearchFullTextClass Favorites PreData', function () {
    var db = null;
    beforeEach(function (done) {
        var dbfile = path.join(__dirname, 'data', 'favorites', 'test.db');
        var dbdata = path.join(__dirname, 'data', 'favorites', 'favorites.yml');
        try {
            fs.unlinkSync(dbfile);
        }
        catch (e) {
        }
        db = new searchfulltext_1.default(dbfile, "test", ['title', 'url']);
        db.init(function () {
            var objs = yaml.safeLoad(fs.readFileSync(dbdata, "utf8"));
            db.importObjs(objs, done);
        });
    });
    afterEach(function (done) {
        db.close(done);
    });
    describe('#search', function () {
        it('test1', function () {
            db.query('dev', function (err, obj) { }, function (err, objs) {
                objs[0].highlights.title.should.equal("Blog de <b>dév</b>eloppement web");
                objs[0].highlights.url.should.equal("http://<b>dev</b>.glicer.com");
            });
        });
        it('test2', function () {
            db.query('glicer', function (err, obj) { }, function (err, objs) {
                objs[0].highlights.url.should.equal("http://dev.<b>glicer</b>.com");
                objs[1].highlights.url.should.equal("http://lyon.<b>glicer</b>.com");
            });
        });
    });
});
describe('SearchFullTextClass Lyon', function () {
    var db = null;
    beforeEach(function (done) {
        var dbfile = path.join(__dirname, 'data', 'lyon', 'test.db');
        var dbdata1 = path.join(__dirname, 'data', 'lyon', 'web.yml');
        var dbdata2 = path.join(__dirname, 'data', 'lyon', 'web2.yml');
        try {
            fs.unlinkSync(dbfile);
        }
        catch (e) {
        }
        db = new searchfulltext_1.default(dbfile, "test", ['title', 'tags', 'description', 'address', 'city'], ['gps']);
        db.init(function () {
            var objs = yaml.safeLoad(fs.readFileSync(dbdata1, "utf8"));
            db.importObjs(objs, function () {
                var objs = yaml.safeLoad(fs.readFileSync(dbdata2, "utf8"));
                db.importObjs(objs, done);
            });
        });
    });
    afterEach(function (done) {
        db.close(done);
    });
    describe('#highlights', function () {
        it('test1', function () {
            var value = { field1: "j'aime le word1", field2: "je préfère le word25 qui est meilleur" };
            var highlights = '0 0 10 5 1 1 14 6';
            db.highlights(["word1", "word2"], ["field1", "field2"], value, highlights);
            value.field1.should.equal("j'aime le <b>word1</b>");
            value.field2.should.equal("je préfère le <b>word2</b>5 qui est meilleur");
        });
    });
    describe("#search", function () {
        it('search1', function () {
            db.query('rest chaponnay', function (err, obj) { }, function (err, objs) {
                objs[0].highlights.title.should.containEql("Aklé");
                objs[0].highlights.tags.should.equal("<b>rest</b>aurant libanais monde");
                objs[0].highlights.address.should.equal("108 rue <b>Chaponnay</b>");
            });
        });
        it('search2', function () {
            db.query('zol', function (err, obj) { }, function (err, objs) {
                objs[0].highlights.title.should.equal("Le <b>Zol</b>a");
            });
        });
        it('search3', function () {
            db.query('lyon', function (err, obj) { }, function (err, objs) {
                objs[0].highlights.title.should.equal("Gym Suédoise <b>Lyon</b>");
            }, 'gps IS NULL');
        });
        it('search4', function () {
            db.query('tags:cinema', function (err, obj) { }, function (err, objs) {
                objs.length.should.equal(2);
                objs[0].highlights.title.should.equal("Cinéma Comoedia");
                objs[1].highlights.title.should.equal("Le Zola");
            });
        });
        it('search5', function () {
            db.query('l\'ame soeur', function (err, obj) { }, function (err, objs) {
                objs.length.should.equal(1);
                objs[0].highlights.title.should.equal("L’<b>Âme</b> <b>Sœur</b>");
            });
        });
    });
});

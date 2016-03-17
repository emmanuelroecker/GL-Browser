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
var index_1 = require('../components/search/index');
var fs = require("fs");
var path = require("path");
var should = require('should');
var persist = should;
describe('IndexClass', function () {
    var db = null;
    beforeEach(function (done) {
        var dbfile = path.join(__dirname, 'data', 'test.db');
        var dbdata1 = path.join(__dirname, 'data', 'web.yml');
        var dbdata2 = path.join(__dirname, 'data', 'web2.yml');
        try {
            fs.unlinkSync(dbfile);
        }
        catch (e) {
        }
        db = new index_1.default(dbfile, "test", ['title', 'tags', 'description', 'address', 'city'], ['gps']);
        db.init(function () {
            db.importYaml(dbdata1, function () {
                db.importYaml(dbdata2, done);
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
            db.query('rest* chaponnay', function (err, obj) { }, function (err, objs) {
                objs[0].title.should.containEql("Aklé");
            });
        });
        it('search2', function () {
            db.query('zol*', function (err, obj) { }, function (err, objs) {
                objs[0].title.should.equal("Le <b>Zol</b>a");
            });
        });
        it('search3', function () {
            db.query('lyon', function (err, obj) { }, function (err, objs) {
                objs[0].title.should.equal("Gym Suédoise <b>Lyon</b>");
            }, 'gps IS NULL');
        });
        it('search4', function () {
            db.query('tags:cinema', function (err, obj) { }, function (err, objs) {
                objs.length.should.equal(2);
                objs[0].title.should.equal("Cinéma Comoedia");
                objs[1].title.should.equal("Le Zola");
            });
        });
        it('search5', function () {
            db.query('l\'ame soeur', function (err, obj) { }, function (err, objs) {
                objs.length.should.equal(1);
            });
        });
    });
});

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
        var dbdata = path.join(__dirname, 'data', 'web.yml');
        try {
            fs.unlinkSync(dbfile);
        }
        catch (e) {
        }
        db = new index_1.default(dbfile, "test", ['title', 'tags', 'description', 'address', 'city'], ['gps']);
        db.init(function () {
            db.importYaml(dbdata, done);
        });
    });
    afterEach(function () {
        db.close();
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
});

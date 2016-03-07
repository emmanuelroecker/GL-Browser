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
var search_1 = require('../components/search/search');
var should = require('should');
var persist = should;
describe('FullTextSearchClass', function () {
    var subject;
    beforeEach(function () {
        subject = new search_1.default("test.db", null, null, null);
    });
    describe('#diacritics', function () {
        it('simple word', function () {
            var result = subject.normalize('école');
            result.should.eql(['ecole']);
        });
        it('multi words', function () {
            var result = subject.normalize('ça été un être chère à cœur chez les zoulous');
            var expected = [
                'ca',
                'un',
                'ete',
                'les',
                'etre',
                'chez',
                'chere',
                'coeur',
                'zoulous'];
            result.should.eql(expected);
        });
        it('french', function () {
            var result = subject.normalize('äâàéèëêïîöôùüûœç');
            result.should.eql(['aaaeeeeiioouuuoec']);
        });
        it('prefixes', function () {
            var result = subject.normalize('economi econo uni universel');
            result.should.eql(['economi', 'universel']);
        });
    });
    describe('#highlights', function () {
        it('test1', function () {
            var value = { field1: "j'aime le word1", field2: "je préfère le word25 qui est meilleur" };
            var highlights = '0 0 10 5 1 1 14 6';
            subject.highlights(["word1", "word2"], ["field1", "field2"], value, highlights);
            value.field1.should.equal("j'aime le <b>word1</b>");
            value.field2.should.equal("je préfère le <b>word2</b>5 qui est meilleur");
        });
    });
    describe('#sqlquery', function () {
        it('test1', function () {
            var result = subject.toQuery(['maison', 'voiture', 'a', 'de']);
            result.should.equal('maison* voiture* de*');
        });
    });
});

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
var normalizefulltext_1 = require('../components/searchfulltext/normalizefulltext');
var should = require('should');
var persist = should;
describe('NormalizeFullTextClass', function () {
    var subject;
    beforeEach(function () {
        subject = new normalizefulltext_1.default();
    });
    describe('#normalizeImport', function () {
        it('test1', function () {
            var result = subject.normalizeImport("L’Âme Sœur");
            result.should.equal("l'ame soeur");
        });
        it('test2', function () {
            var result = subject.normalizeImport("Le Comptoir d'Oz");
            result.should.equal("le comptoir d'oz");
        });
    });
    describe('#normalizeQuery', function () {
        it('simple word', function () {
            var result = subject.normalizeQuery('école');
            result.should.eql(['ecole']);
        });
        it('multi words', function () {
            var result = subject.normalizeQuery('ça été un être chère à cœur chez les zoulous');
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
            var result = subject.normalizeQuery('äâàéèëêïîöôùüûœç');
            result.should.eql(['aaaeeeeiioouuuoec']);
        });
        it('prefixes', function () {
            var result = subject.normalizeQuery('economi econo uni universel');
            result.should.eql(['economi', 'universel']);
        });
    });
    describe('#sqlquery', function () {
        it('test1', function () {
            var result = subject.toQuery(['maison', 'voiture', 'a', 'de']);
            result.should.equal('maison* voiture* de*');
        });
    });
});

"use strict";
var search_1 = require('../command/search');
var should = require('should');
var persist = should;
describe('FullTextSearchClass', function () {
    var subject;
    beforeEach(function () {
        subject = new search_1.default();
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
            var data = { value: { field1: "j'aime le word1", field2: "je préfère le word25 qui est meilleur" }, highlights: '0 0 10 5 1 1 14 6' };
            subject.highlights(["word1", "word2"], ["field1", "field2"], data);
            data.value.field1.should.equal("j'aime le <b>word1</b>");
            data.value.field2.should.equal("je préfère le <b>word2</b>5 qui est meilleur");
        });
    });
    describe('#sqlquery', function () {
        it('test1', function () {
            var result = subject.toQuery(['maison', 'voiture', 'a', 'de']);
            result.should.equal('maison* voiture* de*');
        });
    });
});

/// <reference path="../typings/main.d.ts" />
import FullTextSearchClass from '../command/search';
import should = require('should');
var persist = should;

describe('FullTextSearchClass', () => {
  var subject: FullTextSearchClass;

  beforeEach(function() {
    subject = new FullTextSearchClass();
  });

  describe('#diacritics', () => {
    it('simple word', () => {
      let result: string[] = subject.normalize('école');
      result.should.eql(['ecole']);
    });
    it('multi words', () => {
      let result: string[] = subject.normalize('ça été un être chère à cœur chez les zoulous');
      let expected: string[] = [
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
    it('french', () => {
      let result: string[] = subject.normalize('äâàéèëêïîöôùüûœç');
      result.should.eql(['aaaeeeeiioouuuoec']);
    });
    it('prefixes', () => {
      let result: string[] = subject.normalize('economi econo uni universel');
      result.should.eql(['economi', 'universel']);
    });
  });

  describe('#highlights', () => {
    it('test1', () => {
      let data = {value: {field1: "j'aime le word1", field2: "je préfère le word25 qui est meilleur"}, highlights: '0 0 10 5 1 1 14 6'};

      subject.highlights(["word1", "word2"], ["field1", "field2"], data);

      data.value.field1.should.equal("j'aime le <b>word1</b>");
      data.value.field2.should.equal("je préfère le <b>word2</b>5 qui est meilleur");
    });
  });

  describe('#sqlquery', () => {
    it('test1', () => {
      let result = subject.toQuery(['maison', 'voiture', 'a', 'de']);
      result.should.equal('maison* voiture* de*');
    });
  });

});

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

import FullTextSearchClass from '../components/search/search';
import * as should from 'should';
let persist = should;

describe('FullTextSearchClass', () => {
  let subject: FullTextSearchClass;

  beforeEach(function() {
    subject = new FullTextSearchClass("test.db",null,null,null);
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
      let value = {field1: "j'aime le word1", field2: "je préfère le word25 qui est meilleur"};
      let highlights = '0 0 10 5 1 1 14 6';

      subject.highlights(["word1", "word2"], ["field1", "field2"], value, highlights);

      value.field1.should.equal("j'aime le <b>word1</b>");
      value.field2.should.equal("je préfère le <b>word2</b>5 qui est meilleur");
    });
  });

  describe('#sqlquery', () => {
    it('test1', () => {
      let result = subject.toQuery(['maison', 'voiture', 'a', 'de']);
      result.should.equal('maison* voiture* de*');
    });
  });

});

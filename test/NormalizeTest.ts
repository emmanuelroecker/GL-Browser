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

import NormalizeClass from '../components/search/normalize';
import * as should from 'should';
let persist = should;

describe('NormalizeClass', () => {
  let subject: NormalizeClass;

  beforeEach(function() {
    subject = new NormalizeClass();
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
  
  describe('#sqlquery', () => {
    it('test1', () => {
      let result = subject.toQuery(['maison', 'voiture', 'a', 'de']);
      result.should.equal('maison* voiture* de*');
    });
  });

});

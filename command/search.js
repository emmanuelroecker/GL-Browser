"use strict";
var defaultDiacritics = [
    { base: 'a', characters: 'äâà' },
    { base: 'e', characters: 'éèëê' },
    { base: 'i', characters: 'ïî' },
    { base: 'o', characters: 'öô' },
    { base: 'u', characters: 'ùüû' },
    { base: 'c', characters: 'ç' },
    { base: 'oe', characters: 'œ' },
    { base: "'", characters: '’' }
];
var FullTextSearchClass = (function () {
    function FullTextSearchClass(minQueryLength) {
        if (minQueryLength === void 0) { minQueryLength = 2; }
        this.minQueryLength = 2;
        this.diacriticsMap = [];
        for (var i = 0; i < defaultDiacritics.length; i++) {
            var characters = defaultDiacritics[i].characters.split("");
            for (var j = 0; j < characters.length; j++) {
                this.diacriticsMap[characters[j]] = defaultDiacritics[i].base;
            }
        }
        this.minQueryLength = minQueryLength;
    }
    FullTextSearchClass.prototype.removeDiacritics = function (sentence) {
        if (!sentence)
            return '';
        var map = this.diacriticsMap;
        sentence = sentence.toLowerCase().replace(/[^\u0000-\u007E]/g, function (a) {
            return map[a] || a;
        });
        return sentence;
    };
    FullTextSearchClass.prototype.toQuery = function (words) {
        var length = words.length;
        var result = "";
        var first = true;
        for (var i = 0; i < length; i++) {
            if (words[i].length > 1) {
                if (!first) {
                    result += " ";
                }
                result += words[i];
                if (words[i].indexOf(":") < 0) {
                    result += "*";
                }
                first = false;
            }
        }
        return result;
    };
    FullTextSearchClass.prototype.normalize = function (sentence) {
        if (!sentence)
            return [];
        sentence = this.removeDiacritics(sentence);
        var query = sentence.split(/[^a-z0-9:]+/i);
        query = query.filter(function (word) {
            return word.length > 1;
        });
        query.sort(function (a, b) {
            return a.length - b.length;
        });
        var result = [];
        var length = query.length;
        for (var i = 0; i < length; i++) {
            var word = query[i];
            var ok = true;
            for (var j = i + 1; j < length; j++) {
                if (query[j].indexOf(word) === 0) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                result.push(word);
            }
        }
        return result;
    };
    FullTextSearchClass.prototype.highlights = function (query, fields, result) {
        var coords = result.highlights.split(/ /);
        var length = coords.length;
        var i = 0;
        var colnumInc = Array.apply(null, Array(fields.length)).map(function () {
            return 0;
        });
        while (i < length) {
            var colnum = coords[i++];
            var itemnum = coords[i++];
            var offset = parseInt(coords[i++]) + colnumInc[colnum];
            var size = coords[i++];
            var value = result.value[fields[colnum]];
            var queryLength = query[itemnum].length;
            result.value[fields[colnum]] = value.substr(0, offset) + "<b>" + value.substr(offset, queryLength) + "</b>" + value.substr(offset + queryLength);
            colnumInc[colnum] += 7;
        }
    };
    FullTextSearchClass.prototype.httpGet = function (url, callback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                callback(JSON.parse(anHttpRequest.responseText));
            }
        };
        anHttpRequest.open("GET", url, true);
        anHttpRequest.send(null);
    };
    FullTextSearchClass.prototype.query = function (words, callbackEach, callbackEnd, filter, hightlights) {
        if (filter === void 0) { filter = null; }
        if (hightlights === void 0) { hightlights = true; }
        if (words.length < this.minQueryLength) {
            callbackEnd(null);
            return;
        }
        var query = this.normalize(words);
        var highlights = this.highlights;
        if (!filter) {
            filter = '';
        }
    };
    return FullTextSearchClass;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FullTextSearchClass;

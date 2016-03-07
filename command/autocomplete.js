'use strict';

let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');

/*
query:string[] - liste des débuts de mots recherchés (['je','cherc','un','truc'])
fields:string[] - liste de tous les champs de la table

result.offsets is a text value containing a series of space-separated integers

*/
let highlights = function (query, fields, result) {
	let coords = result.offsets.split(/ /);
	let length = coords.length;
	let colnumInc = Array.apply(null, Array(fields.length)).map(function () { //créer un tableau du nombre de fields avec valeur 0
		return 0;
	});
	let i = 0;
	while (i < length) {
		let colnum = coords[i++]; //The column number that the term instance occurs in (0 for the leftmost column of the FTS table, 1 for the next leftmost, etc.).
		let itemnum = coords[i++]; //The term number of the matching term within the full-text query expression. Terms within a query expression are numbered starting from 0 in the order that they occur.
		let offset = parseInt(coords[i++]) + colnumInc[colnum]; //The byte offset of the matching term within the column.
		let value = result.value[fields[colnum]]; //valeur du champs correspondant avant highlights
		let queryLength = query[itemnum].length; //The size of the matching term in bytes.
		result.value[fields[colnum]] = value.substr(0, offset) + '<b>' + value.substr(offset, queryLength) + '</b>' + value.substr(offset + queryLength); //remplace les champs en insérant les balises b
		colnumInc[colnum] += 7;
	}
};

db.serialize(function () {
	db.run('CREATE VIRTUAL TABLE pages USING fts4(title, keywords, body);');

	let stmt = db.prepare('INSERT INTO pages VALUES (?,?,?)');
	stmt.run('test1', 'bonjour rien du tout', 'corps du text');
	stmt.run('test2', 'tout pour ça', 'second texte');
	stmt.finalize();

	db.each('SELECT body,offsets(pages) AS offset FROM pages WHERE keywords MATCH "ça";', function (err, row) {
		console.log(row.body);
		console.log(row.offset);
	});
});

db.close();

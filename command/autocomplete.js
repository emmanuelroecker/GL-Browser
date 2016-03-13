'use strict';
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');

db.serialize(function () {
	db.run('CREATE VIRTUAL TABLE pages USING fts4(title, keywords, body);');

	let stmt = db.prepare('INSERT INTO pages VALUES (?,?,?)');
	stmt.run('test1', 'bonjour rien du tout', 'corps du text');
	stmt.run('test2','tout pour ça', 'second texte', function(err) {
		console.log(err);
	});
	stmt.finalize();

	db.each('SELECT body,offsets(pages) AS offset FROM pages WHERE keywords MATCH "ça";', function (err, row) {
		console.log(row.body);
		console.log(row.offset);
	});
});

db.close();

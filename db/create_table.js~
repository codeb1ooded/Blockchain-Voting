var mysql = require('mysql');
const crypto = require('crypto');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toor",
    database: "USERS"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    var sql = "INSERT INTO CREDENTIALS (aadharcard, voterid, uniqueKey, publickey_valid, publickey_invalid, voted) VALUES ?";
    var values = [
        ['334890654763',
        '6438762671',
        crypto.createHash('sha256').update('334890654763' + '6438762671').digest('hex'),
        crypto.createHash('sha256').update('334890654763' + '6438762671' + 'qwertyuiop').digest('hex'),
        crypto.createHash('sha256').update('334890654763' + '6438762671' + 'poiuytrewq').digest('hex'),
        0],
	['445023056153',
        '1045672333',
        crypto.createHash('sha256').update('445023056153' + '1045672333').digest('hex'),
        crypto.createHash('sha256').update('445023056153' + '1045672333' + 'qwertyuiop').digest('hex'),
        crypto.createHash('sha256').update('445023056153' + '1045672333' + 'poiuytrewq').digest('hex'),
        0]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});

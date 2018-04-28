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
    var sql = "INSERT INTO CREDENTIALS (name, address) VALUES ?";
    var values = [
        ['aadhar card',
        'voter id',
        crypto.createHash('sha256').update('aadhar card' + 'voter id').digest('hex'),
        crypto.createHash('sha256').update('aadhar card' + 'voter id' + 'password 1').digest('hex'),
        crypto.createHash('sha256').update('aadhar card' + 'voter id' + 'password 2').digest('hex'),
        0]
    ];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});

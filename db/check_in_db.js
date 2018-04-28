var mysql = require('mysql');
const crypto = require('crypto');

//var aadharcard = "000000000001";
//var voterid = "1234567890";
//var password = "qwertyuiop";
exports.check_in_db = function (aadharcard, voterid, password, callback){
	var con = mysql.createConnection({
    		host: "localhost",
    		user: "root",
    		password: "toor",
    		database: "USERS"
	});
	con.connect(function(err) {
		if(err) throw err;
		var unique_key = crypto.createHash('sha256').update(aadharcard + voterid).digest('hex');
		var pass_key = crypto.createHash('sha256').update(aadharcard + voterid + password).digest('hex');
		con.query("SELECT * FROM CREDENTIALS WHERE uniqueKey='"+unique_key+"'", function (err, result) {
        		if (err) throw err; 
//console.log(aadharcard);
//console.log(voterid);
//console.log(password);
//console.log(result);
			if(result.length >= 1){
//console.log(pass_key);
//console.log(result[0].publickey_valid == pass_key || result[0].publickey_invalid == pass_key);
//console.log((result[0].publickey_valid == pass_key || result[0].publickey_invalid == pass_key) && result[0].voted == 0);
				if(result[0].publickey_valid == pass_key || result[0].publickey_invalid == pass_key){
					if(result[0].voted == 1)	callback("ALREADY_VOTED");
					else				callback("CAN_VOTE");
				}
			}
			else{
				callback("NOT_AUTHENTICATED");
			}
		});
	});
}

exports.is_already_voted = function (aadharcard, voterid, callback){
	var con = mysql.createConnection({
    		host: "localhost",
    		user: "root",
    		password: "toor",
    		database: "USERS"
	});
	con.connect(function(err) {
		if(err) throw err;
		var unique_key = crypto.createHash('sha256').update(aadharcard + voterid).digest('hex');
		con.query("SELECT * FROM CREDENTIALS WHERE uniqueKey='"+unique_key+"'", function (err, result) {
        		if (err) throw err; 
			callback(result[0].voted == 1);
		});
	});
}


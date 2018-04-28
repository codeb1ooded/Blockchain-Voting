var mysql = require('mysql');
const crypto = require('crypto');

exports.vote_for_user = function (aadharcard, voterid, pass_key, candidate, callback){
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
			if(result.length >= 1){
				if(result[0].publickey_valid == pass_key){
					con.query("UPDATE CREDENTIALS SET voted=1 WHERE publickey_valid='"+pass_key+"'", function (err, result) {
						if (err) throw err; 
						callback(candidate);
					});
				}
				else{
					callback(candidate);
				}
			}
			else{
				callback("null");
			}
		});
	});
}


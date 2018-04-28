var http = require("http");
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var ejs = require('ejs');

const crypto = require('crypto');
var check_in_db = require('./db/check_in_db');
const cast_vote = require('./db/cast_vote');


var aadharcard, voterid, pass_key;

http.createServer(function (request, response) {
    var q = url.parse(request.url, true);
    if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
    	sendFileContent(response, request.url.toString().substring(1), "text/css");
    }
    else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
    	sendFileContent(response, request.url.toString().substring(1), "text/javascript");
    }
    else if(q.pathname == "/authenticate"){
        if (request.method == 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    request.connection.destroy();
                }
            });
            request.on('end', function () {
                var post = qs.parse(body);
		aadharcard = post.aadharcard;
		voterid = post.voterid;
		pass_key = crypto.createHash('sha256').update(aadharcard + voterid + post.password).digest('hex');
                // use POST
                //console.log(post.aadhardcard);
                //console.log(post.voterid);
                //console.log(post.password);
		check_in_db.check_in_db(aadharcard, voterid, post.password, function(result) {
			//console.log("result on auth page");
			console.log(result);
			var filename;
			if(result == "ALREADY_VOTED")	filename = "./already_voted.html";
			else if(result == "CAN_VOTE")	filename = "./vote.html";
			else				filename = "./unauthenticated.html";
			fs.readFile(filename, function(err, data) {
            			if (err) {
            		    		response.writeHead(404, {'Content-Type': 'text/html'});
            		    		return response.end("404 Not Found");
            			}
            			response.writeHead(200, {'Content-Type': 'text/html'});
            			response.write(data);
            			return response.end();
        		});
		});
            });
        }
    }
    else if(q.pathname == "/voted"){
	 if (request.method == 'POST') {
            var body = '';
            request.on('data', function (data) {
                body += data;
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6) {
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    request.connection.destroy();
                }
            });
            request.on('end', function () {
                var post = qs.parse(body);
		var candidate = post.candidate;
		//console.log("printing candidate");
		//console.log(candidate);
		cast_vote.vote_for_user(aadharcard, voterid, pass_key, candidate, function(result) {
 
			//console.log(result);
			if(result != 'null'){
				 response.writeHead(200, {'Content-Type': 'text/html'});
				 fs.readFile('voted.html', 'utf-8', function(err, content) {
    					if (err) {
      						response.writeHead(404, {'Content-Type': 'text/html'});
            		    			return response.end("404 Not Found");
    					}

   					var renderedHtml = ejs.render(content, {candidate: candidate});  //get redered HTML code
    					response.end(renderedHtml);
  				});
			}
			else{
				fs.readFile("./voted.html", function(err, data) {
            				if (err) {
            		    			response.writeHead(404, {'Content-Type': 'text/html'});
            		    			return response.end("404 Not Found");
            				}
            				response.writeHead(200, {'Content-Type': 'text/html'});
            				response.write(data);
            				return response.end();
        			});
			}
		});
            });
        }
    }
    else{
        var filename = "." + q.pathname + ".html";
        fs.readFile(filename, function(err, data) {
            if (err) {
                response.writeHead(404, {'Content-Type': 'text/html'});
                return response.end("404 Not Found");
            }
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            return response.end();
        });
    }
}).listen(8081);

// fs.readFile('./index.html', function (err, html) {
//     if (err) {
//         throw err;
//     }
//     http.createServer(function(request, response) {
//         response.writeHeader(200, {"Content-Type": "text/html"});
//         response.write(html);
//         response.end();
//     }).listen(8081);
// });


function sendFileContent(response, fileName, contentType){
  fs.readFile(fileName, function(err, data){
    if(err){
      response.writeHead(404);
      response.write("Not Found!");
    }
    else{
      response.writeHead(200, {'Content-Type': contentType});
      response.write(data);
    }
    response.end();
  });
}


// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

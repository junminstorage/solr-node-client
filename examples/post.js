/**
 * Add remote resource into the Solr index.
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');
var httpProxy = require('http-proxy-agent');
var fs = require('fs');
var request = require('request');
var path = require('path');

var proxy = process.env.http_proxy || 'http://bproxy.cfe.bloomberg.com:80';
console.log('use proxy server %j', proxy);
var agent = new httpProxy(proxy);

// Create a client
var client = solr.createClient({host:'sundev29.dev.bloomberg.com', core:'test', agent:agent});
// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

//map file extension to mime type
var mimeMap = {};
mimeMap["xml"] = "application/xml";
mimeMap["csv"] = "text/csv";
mimeMap["json"] = "application/json";
mimeMap["pdf"] = "application/pdf";
mimeMap["rtf"] = "text/rtf";
mimeMap["html"] = "text/html";
mimeMap["htm"] = "text/html";
mimeMap["doc"] = "application/msword";
mimeMap["docx"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
mimeMap["ppt"] = "application/vnd.ms-powerpoint";
mimeMap["pptx"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
mimeMap["xls"] = "application/vnd.ms-excel";
mimeMap["xlsx"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
mimeMap["odt"] = "application/vnd.oasis.opendocument.text";
mimeMap["ott"] = "application/vnd.oasis.opendocument.text";
mimeMap["odp"] = "application/vnd.oasis.opendocument.presentation";
mimeMap["otp"] = "application/vnd.oasis.opendocument.presentation";
mimeMap["ods"] = "application/vnd.oasis.opendocument.spreadsheet";
mimeMap["ots"] = "application/vnd.oasis.opendocument.spreadsheet";
mimeMap["txt"] = "text/plain";
mimeMap["log"] = "text/plain";

var UPDATE_HANDLER = "/update";
var EXTRACT_HANDLER = '/update/extract';

var handlerMap = {'application/xml':UPDATE_HANDLER, 'text/csv':UPDATE_HANDLER, 'application/json':UPDATE_HANDLER};

/*
 * csv, json, xml using update/
 * others using /extract
 * 
 * default: application/octet-stream
 */
var host = "http://sundev29.dev.bloomberg.com";
var port = "8983";
var collection = "test";

//list of provided files or directories
var files = ["./materials/solr-word.pdf"];

var filesPosted = 0;
var results = [];
files.forEach(function(file){
	file = path.resolve('.', file);
	fs.stat(file, function(err, stat){
		if(stat && stat.isDirectory()){
			walkDir(file, function(err, posted, res){
				if(err)
					console.log(err);
				results = results.concat(res);
				filesPosted++;
				console.log("#file posted so far: " +filesPosted);
				console.log("files posted so far: " + results)
			});
		}else{
			postFile(file);
			results.push(file);
			filesPosted++;
			console.log("#file posted so far: " +filesPosted);
			console.log("files posted so far: " + results)
		}
	});	
	
})


var walkDir = function(dir, done) {
 console.log("walk directory: " + dir);
  var results = [];
  var posted = 0; 
  fs.readdir(dir, function(err, list) {
    if (err) { console.log(err); return done(err)};
    var pending = list.length;
    console.log('pending: '+pending);
    if (!pending) return done(null, posted, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      console.log('file: '+file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walkDir(file, function(err, posted, res) {
            results = results.concat(res);
            posted++;
            if (!--pending) done(null, posted, results);
          });
        } else {
          postFile(file);
          results.push(file);
          posted++;
          if (!--pending) done(null, posted, results);
        }
      });
    });
  });
};

var postFile = function(fileName){
console.log("post file: " + fileName);
//var fileName = "./materials/products.csv";
var contentType = mimeMap[guessFileType(fileName)];

var handler = handlerMap[contentType]?handlerMap[contentType]:EXTRACT_HANDLER;

var stats = fs.statSync(fileName);
var fileSizeInBytes = stats["size"];

console.log('file length: ' +fileSizeInBytes);

var options = {
		  url: host + ':' + port + '/solr/' + collection + handler, 
		  agent: agent,
		  headers: {
			  'Content-Type': contentType,
	          'Content-Length': fileSizeInBytes
		  }
};

console.log(options);

fs.createReadStream(fileName).pipe(request.post(options, function(err, response, body){
	console.log(err + JSON.stringify(response) + body);
}))

};

//commit 
//client.commit(function(err, response, body){
//	console.log(err + JSON.stringify(response) + body);
//});

function guessFileType(fileName) {
	return fileName.substr(fileName.lastIndexOf('.')+1);
}
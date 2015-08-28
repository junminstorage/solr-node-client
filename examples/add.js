/**
 * Add documents into the Solr index.
 */

// Use `var solr = require('solr-client')` in your code 
var solr = require('./../lib/solr');
var httpProxy = require('http-proxy-agent');

var proxy = process.env.http_proxy || 'http://bproxy.cfe.bloomberg.com:80';
console.log('use proxy server %j', proxy);
var agent = new httpProxy(proxy);

// Create a client
var client = solr.createClient({host:'sundev29.dev.bloomberg.com', core:'test', agent:agent});

// Switch on "auto commit", by default `client.autoCommit = false`
client.autoCommit = true;

var docs = [];
for(var i = 0; i <= 1 ; i++){
   var doc = {
       id : 12345 + i,
       title_t : "Title "+ i,
       description_t : "Text"+ i + "Alice"
   }
   docs.push(doc);
}

// Add documents
client.add(docs,function(err,obj){
   if(err){
      console.log(err);
   }else{
      console.log(obj);
   }
});

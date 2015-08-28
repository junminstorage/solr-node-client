var SolrClient = require('./../lib/solrClient');

var httpProxy = require('http-proxy-agent');
var fs = require('fs');
var request = require('request');
var path = require('path');

var proxy = process.env.http_proxy || 'http://bproxy.cfe.bloomberg.com:80';
console.log('use proxy server %j', proxy);
var agent = new httpProxy(proxy);

var client = new SolrClient({baseUrl:'http://sundev29.dev.bloomberg.com:8983/solr', core:'test', agent:agent});

client.postFile("./materials/solr-word.pdf", function(err, response, body){
	console.log(response);
});
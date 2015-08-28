var SolrClient = require('./../lib/solrClient');
var SolrQuery = require('./../lib/solrQuery');

var httpProxy = require('http-proxy-agent');
var fs = require('fs');

var proxy = process.env.http_proxy || 'http://bproxy.cfe.bloomberg.com:80';
var agent = new httpProxy(proxy);

var client = new SolrClient({baseUrl:'http://sundev29.dev.bloomberg.com:8983/solr', core:'test', agent:agent});

//client.adminStatus(null, function(err, response, body){
//	console.log(err + JSON.stringify(response));
//});


query = new SolrQuery();
client.adminStatus(query.core('test').indexInfo(false), function(err, response, body){
	console.log(err + JSON.stringify(response));
});
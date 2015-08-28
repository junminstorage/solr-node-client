var SolrClient = require('./../lib/solrClient');

var httpProxy = require('http-proxy-agent');
var fs = require('fs');
var request = require('request');
var path = require('path');

var proxy = process.env.http_proxy || 'http://bproxy.cfe.bloomberg.com:80';
var agent = new httpProxy(proxy);

var client = new SolrClient({baseUrl:'http://sundev29.dev.bloomberg.com:8983/solr', core:'test', agent:agent});

client.commit(null, function(err, response, body){
	console.log(err + response);
});

client.commit();
var querystring = require('querystring'),
    format = require('./utils/format');

/**
 * Expose `SolrQuery`
 */
module.exports = exports = SolrQuery;

/*
 * @constructor
 *
 * @return {SolrQuery}
 */

function SolrQuery(){
	this.parameters = {'wt':'json'};
}

SolrQuery.prototype.add = function(pname, pval){
	this.parameters[pname] = pval;
	return this;
}

/*
 * create query string from hash map of parameter and value
 */
SolrQuery.prototype.toQueryString = function(){
	var that = this;
	return Object.keys(this.parameters).map(function(key){
		return key + '=' + that.parameters[key]
	}).join('&');
}

/*
 * admin queries
 */
SolrQuery.prototype.action = function(val){
	this.add('action', val)
	return this;
}

SolrQuery.prototype.core = function(val){
	this.add('core', val)
	return this;
}

SolrQuery.prototype.indexInfo = function(val){
	this.add('indexInfo', val)
	return this;
}




/**
 * Sort a result in descending or ascending order based on one or more fields.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.sort = function(options){
   var self = this;
   var parameter = 'sort=';
   parameter += querystring.stringify(options, ',' , '%20');
   this.parameters.push(parameter);
   return self;
}

SolrQuery.prototype.qt = function(val){
	  this.add('qt', val);
	  return this;
	}

SolrQuery.prototype.defType = function(type){
	this.add('defType', val);
	return this;
}


/**
 *
 * @return {SolrQuery}
 * @api public
 */

SolrQuery.prototype.dismax = function(){
   this.defType('dismax');
   return this;
}

/*
 *
 * @return {SolrQuery}
 * @api public
 */

SolrQuery.prototype.edismax = function(){
   this.defType('edismax');
   return this;
}

/*
 * @return {SolrQuery}
 * @api public
 */

SolrQuery.prototype.debugQuery = function(){
	this.add('debugQuery', 'true');
	return this;
}

/**
 * Set the "boosts" to associate with each fields
 *
 * @param {Object} options -
 *
 * @return {SolrQuery}
 * @api public
 *
 * @example
 * var query = SolrQuery();
 * query.qf({title : 2.2, description : 0.5 });
 */

SolrQuery.prototype.qf = function(options){
   this.add('qf', querystring.stringify(options, '%20' , '^'));
   return this;
}

/**
 * Set the minimum number or percent of clauses that must match.
 *
 * @param {String|Number} minimum - number or percent of clauses that must match
 *
 * @return {SolrQuery}
 * @api public
 *
 */

SolrQuery.prototype.mm = function(val){
   this.add('mm', val);
   return this;
}

/**
 * Set the Phrase Fields parameter.
 * Once the list of matching documents has been identified using the "fq" and "qf" params, the "pf" param can be used to "boost" the score of documents in cases where all of the terms
 * in the "q" param appear in close proximity.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.pf = function(options){
   var self = this;
   var parameter = 'pf=' ;
   parameter += querystring.stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the phrase slop allowed in a query.
 *
 * @param {Number} slop - Amount of phrase slop allowed by the query filter. This value should represent the maximum number of words allowed between words in a field that match a phrase in the query.
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.ps = function(slop){
   var self = this;
   var parameter = 'ps=' + slop;
   this.parameters.push(parameter);
   return self;
};

/**
 * Set the query slop allowed in a query.
 *
 * @param {Number} slop - Amount of query slop allowed by the query filter. This value should be used to affect boosting of query strings.
 *
 * @return {Query}
 * @api public
 */
SolrQuery.prototype.qs = function(slop){
   var self = this;
   var parameter = 'qs=' + slop;
   this.parameters.push(parameter);
   return self;
};

/**
 * Set the tiebreaker in DisjunctionMaxQueries (should be something much less than 1)
 *
 * @param {Float|Number} tiebreaker -
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.tie = function(tiebreaker){
   var self = this;
   var parameter = 'tie=' + tiebreaker;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Boost Query parameter.
 * A raw query string (in the SolrQuerySyntax) that will be included with the user's query to influence the score. If this is a BooleanQuery with a default boost (1.0f) then the individual clauses will be added directly to the main query. Otherwise, the query will be included as is.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.bq = function(options){
   var self = this;
   var parameter = 'bq=' ;
   parameter += querystring.stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}


/**
 * Set the Functions (with optional boosts) that will be included in the user's query to influence the score.
 * @param {String} functions - e.g.: `recip(rord(myfield),1,2,3)^1.5`
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.bf = function(functions){
   var self = this;
   var parameter = 'bf=' + functions;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Functions (with optional boosts) that will be included in the user's query to influence the score.
 * @param {String} functions - e.g.: `recip(rord(myfield),1,2,3)^1.5`
 *
 * @return {Query}
 * @api public
 */

SolrQuery.prototype.boost = function(functions){
   var self = this;
   var parameter = 'boost=' + encodeURIComponent(functions);
   this.parameters.push(parameter);
   return self;
}

/**
 * Build a querystring with the array of `this.parameters`.
 *
 * @return {String}
 * @api private
 */
SolrQuery.prototype.build = function(){
   return this.parameters.join('&');
}

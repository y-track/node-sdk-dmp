/**
 * Modules dependencies
 */
var jwt 	= require('jsonwebtoken'),
	fs  	= require('fs'),
	Promise = require('es6-promise').Promise;

/**
 * Creates an instance of SDK 
 *
 * The constructor load informations int the file (like certificates)
 *
 * Params :
 * 		- `conf` 	It's the file configuration
 *
 * @constructor
 * @param {String} conf
 */
var SDK = function (conf) {
	this._conf = conf;
};


/**
 * Compare the difference between twos dates
 *
 * Params :
 * 		- `a` 	The first Date
 *		- `b` 	The Secondly Date
 *
 * @constructor
 * @param {Date} a 
 * @param {Date} b 
 * @return {Number} 
 */
SDK.prototype.sortByDateDesc = function (a, b) {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/**
 * Retrieves the most recent certificate in relation to the date iat (in the accessToken)
 * 
 * Params :
 * 		- `accessToken` 	
 *
 * @constructor
 * @param {String} accessToken
 * @return {String} currentCertificate
 */
SDK.prototype.getCurrentPublicKey = function(accessToken) {

	var certificates = this._conf.certificates;

	certificates.sort(this.sortByDateDesc);

	for (var i = 0; i < certificates.length; i++) {
		var dateInTimestamp = new Date(certificates[i].date).getTime() / 1000;
		if (dateInTimestamp <= this.decodeIat(accessToken)) {
			return certificates[i].path;
		}
	}
}

// To review 
SDK.prototype.signToken = function(tokenContent, cert) {
	return jwt.sign(tokenContent, cert, {algorithm: "RS256"});
}

/**
 * Retrieves the iat (creation date of token)
 * 
 * Params :
 * 		- `accessToken` 	
 *
 * @constructor
 * @param {String} accessToken
 * @return {Number} iat
 */
SDK.prototype.decodeIat = function(accessToken) {
	return (jwt.decode(accessToken).iat);
}

SDK.prototype.decodeAccount = function(accessToken) {
	return (jwt.decode(accessToken).account);
}

SDK.prototype.checkAccountToken = function(accessToken, account) {
	return (this.decodeAccount(accessToken) ===  account);
}

/**
 * Verify the signature of token.
 * 
 * Params :
 * 		- `accessToken` 	
 *
 * @constructor
 * @param {String} accessToken
 * @return {Object} decoded accessToken or an error
 */
SDK.prototype.verifyToken = function(accessToken) {

	var certificateCurrent = this.getCurrentPublicKey(accessToken, this._conf);

	var readFile = function (filename) {
		return new Promise(function(resolve, reject) {
			require('fs').readFile(filename, function (err, data) {
				if (err) reject(err);
				resolve(data);
			});
		});
	};

	return readFile(certificateCurrent).then(function (fileContent) {
		return jwt.verify(accessToken, fileContent);
	});
}

module.exports = SDK;
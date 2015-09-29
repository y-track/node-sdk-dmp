require('es6-promise').polyfill();

/**
 * Modules dependencies
 */
var jwt     = require('jsonwebtoken'),
    fs      = require('fs');

/**
 * Creates an instance of SDK 
 *
 * The constructor load informations int the file (like certificates)
 *
 * Params :
 *         - `conf`     It's the file configuration
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
 *         - `a`     The first Date
 *        - `b`     The Secondly Date
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
 *         - `accessToken`     
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
 *         - `accessToken`     
 *
 * @constructor
 * @param {String} accessToken
 * @return {Number} iat
 */
SDK.prototype.decodeIat = function(accessToken) {
    return (jwt.decode(accessToken).iat);
}

SDK.prototype.decodeScopes = function(accessToken) {
    return (jwt.decode(accessToken).scopes);
}

/**
 * Verify the signature of token.
 * 
 * Params :
 *         - `accessToken`     
 *
 * @constructor
 * @param {String} accessToken
 * @return {Object} decoded accessToken or an error
 */
SDK.prototype.verifyToken = function(accessToken) {

    var certificateCurrent = this.getCurrentPublicKey(accessToken);

    var readFile = new Promise(function(resolve, reject) {
        fs.readFile(certificateCurrent, function (err, data) {
            if (err) reject(err);
            resolve(data);
        });
    });

    return readFile.then(function (fileContent) {
        return jwt.verify(accessToken, fileContent);
    });
}

/**
 * Verify scope in token with scope to compare
 * 
 * Params :
 *         - `scopesToken` : scopes in token
 *         - `scope` : scope to compare 
 *
 * @constructor
 * @param {String} scopesToken
 * @return {String} scope
 */
SDK.prototype.verifyScopes = function (scopesToken, scope) {

    var scopesToArray = scopesToken.split(",");
    for (i = 0; scopesToArray.length != i; i++) {
        //Check scope format
        if (null === scopesToArray[i].match(/^[a-z]+:[a-z0-9]*:[a-zA-Z0-9*]*$/)) {
            return false;
        } else {
            //Check exact match
            if (scopesToArray[i] === scope) {
                return true;
            }
            else {
                // scopeWithJoker : manage scope with the caracter *
                var scopeWithJoker = scope.match(new RegExp(scopesToArray[i].replace(/\*/g, '[a-zA-Z0-9]')));
                if (null !== scopeWithJoker) {
                    return true;
                }
            }
        }
    }
    return false;
}

module.exports = SDK
require('es6-promise').polyfill();

/**
 * Modules dependencies
 */
var jwt  = require('jsonwebtoken'),
    fs   = require('fs'),
    Type = require('type-of-is');

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
 *        - `a`     The first Date
 *        - `b`     The Secondly Date
 *
 * @constructor
 * @param {Date} a
 * @param {Date} b
 * @return {Number}
 */
SDK.prototype.sortByDateDesc = function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
};

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

    return new Promise(function (resolve, reject) {
        var certificates = this._conf.certificates;
        certificates.sort(this.sortByDateDesc);
        for (var i = 0; i < certificates.length; i++) {
            var dateInTimestamp = new Date(certificates[i].date).getTime() / 1000;
            if (dateInTimestamp <= this.decodeIat(accessToken)) {
                return resolve(certificates[i].path);
            }
        }
        return reject(new Error("Don't find a valid public key"));   
    }.bind(this));
};

// To review
SDK.prototype.signToken = function(tokenContent, cert) {
    return jwt.sign(tokenContent, cert, {algorithm: "RS256"});
};

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
};

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

    if (jwt.decode(accessToken) === null) {
        return Promise.reject(new Error("Access token is null"));
    }

    return this.getCurrentPublicKey(accessToken).then(function (certificateCurrent) {
        return new Promise(function (resolve, reject) {
            fs.readFile(certificateCurrent, function (err, data) {
                if (err) return reject(err);
                return resolve(data);
            });
        });
    }).then(function (data) {
        var payload = jwt.verify(accessToken, data);
        if (null === payload) {
            return Promise.reject(new Error("Token's payload is null"));
        }
        return payload;
    });
};

/**
 * Verify scope in token with scope to compare
 *
 * Params :
 *         - `scopesToken` : scopes in token
 *         - `scope` : scope to compare
 *
 * @constructor
 * @param {Array} scopesToken
 * @return {String} scope
 */
SDK.prototype.verifyScopes = function (scopesToken, scope) {

    if (false === Type.is(scopesToken, Array)) {
        return Promise.reject(new Error("Scope in the token isn't a good format - Scope to be an Array"));
    }
    if (false === Type.is(scope, String)) {
        return Promise.reject(new Error("Scope isn't a good format - Scope to be a String"));
    }

    return new Promise(function (resolve, reject) {
        for (i = 0; scopesToken.length != i; i++) {
            //Check scope format
            if (null === scopesToken[i].match(/^[a-z]+:[a-z0-9*]*:[a-zA-Z0-9*]*$/)) {
                return reject(false);
            } else {
                //Check exact match
                if (scopesToken[i] === scope) {
                    return resolve(true);
                }
                else {
                    // scopeWithJoker : manage scope with the caracter *
                    var scopeWithJoker = scope.match(new RegExp(scopesToken[i].replace(/\*/g, '[a-zA-Z0-9*]*')));
                    if (null !== scopeWithJoker) {
                        return resolve(true);
                    }
                }
            }
        }
        return reject(false);   
    }.bind(this));
    
};

module.exports = SDK;

var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_sept.key');
var privateKey2 = require('fs').readFileSync('./config/private_october.key');
var app 		= new SDK(conf["SDK"]);

var tokenContent = {
	account: "999999",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: ["toto::plop", "toto:*:*"]
};

// good token
var accessToken = app.signToken(tokenContent, privateKey);
// bad token
var accessToken2 = app.signToken(tokenContent, privateKey2);

console.log(app.verifyScopes(tokenContent.scopes, "toto::plop"));
console.log(app.verifyScopes(tokenContent.scopes, "toto::*"));
console.log(app.verifyScopes(tokenContent.scopes, "titi:*:*"));


var testPromise = app.verifyToken(accessToken);
var testPromise2 = app.verifyToken(accessToken2);

testPromise.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);
});

testPromise2.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);
});
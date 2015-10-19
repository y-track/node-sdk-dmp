var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_sept.key');
var privateKey2 = require('fs').readFileSync('./config/private_october.key');
var app 		= new SDK(conf["SDK"]);

var tokenContent = {
	account: "012345",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: ["plop::post*"]
};


//good token
var goodToken = app.signToken(tokenContent, privateKey);

//bad token
var badToken = app.signToken(tokenContent, privateKey2);


//Test on getCurrentPublicKey
var currentPublicKey = app.getCurrentPublicKey(goodToken);

currentPublicKey.then(function (res) {
	console.log(res);
}).catch(function (err) {
	console.log(err);
});

var currentPublicKey2 = app.getCurrentPublicKey(badToken);

currentPublicKey2.then(function (res) {
	console.log(res);
}).catch(function (err) {
	console.log(err);
});


//Test verifyScopes
verifyScopes1 = app.verifyScopes(null, "plop::postUnicorn");
verifyScopes2 = app.verifyScopes(tokenContent.scopes, "toto::*");

verifyScopes1.then(function (res) {
	console.log(res);
}).catch(function (err) {
	console.log(err);
});

verifyScopes2.then(function (res) {
	console.log(res);
}).catch(function (err) {
	console.log(err);
});



var verifyToken = app.verifyToken(goodToken);
var verifyToken2 = app.verifyToken(badToken);

verifyToken.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);
});

verifyToken2.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);
});
var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_sept.key');
var privateKey2 = require('fs').readFileSync('./config/private_october.key');
var app 		= new SDK(conf["SDK"]);

var tokenContent = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::getVisitor,profilehub::getVisitors,profilehub::getVisitorsFields,profilehub::getRelease,abc,profilehub::getToto"
};

var tokenContent2 = {
	account: "000003",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "toto"
};

var tokenContent4 = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::get*,profilehub::getVisitor*,profile*::get*"
};

var tokenContent5 = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::p*"
};

var tokenContent6 = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::*"
};

// console.log(app.verifyScopes(tokenContent4.scopes, 'profilehub::getVisitors')); //true
// console.log(app.verifyScopes(tokenContent2.scopes, 'profilehub::getVisitor')); //false
// console.log(app.verifyScopes(tokenContent.scopes, 'profilehub::getRelease')); //true
// console.log(app.verifyScopes(tokenContent6.scopes, 'profilehub::getToto')); // true
// console.log(app.verifyScopes(tokenContent5.scopes, 'profilehub::getTchou1991')); // false
// console.log(app.verifyScopes(tokenContent5.scopes, 'profilehub::plop')); // true
// console.log(app.verifyScopes(tokenContent5.scopes, 'profilehub::postRelease')); // true

//good token
var accessToken = app.signToken(tokenContent, privateKey);
//bad account
var accessToken3 = app.signToken(tokenContent2, privateKey);
//one scope
var accessToken4 = app.signToken(tokenContent4, privateKey);
//bad scope
var accessToken5 = app.signToken(tokenContent5, privateKey);
//bad token
var accessToken2 = app.signToken(tokenContent, privateKey2);
//super scope
var accessToken6 = app.signToken(tokenContent6, privateKey);

console.log("Good Token:");
console.log(accessToken);
console.log("Good Token but wrong account:");
console.log(accessToken3);
console.log("Bad Token :")
console.log(accessToken2);
console.log("Good token - one scope :")
console.log(accessToken4);
console.log("Good token - bad scope :")
console.log(accessToken5);
console.log("Good token - Super scope :")
console.log(accessToken6);


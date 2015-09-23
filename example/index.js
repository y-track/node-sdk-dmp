var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_sept.key');
var privateKey2 = require('fs').readFileSync('./config/private_october.key');

var tokenContent = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::getVisitor,profilehub::getVisitors,profilehub::getVisitorsFields,profilehub::getRelease"
};

var tokenContent2 = {
	account: "000003",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "toto"
};

var tokenContent4 = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::getRelease,profilehub::getVisitor,profilehub::getHealthcheck"
};

var tokenContent5 = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::plop"
};

var tokenContent6 = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "profilehub::*"
};

var app = new SDK(conf["SDK"]);

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
var accessToken2 = app.signToken(tokenContent6, privateKey);

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


console.log(app.verifyScopes(tokenContent4.scopes, 'profilehub::getVisitor'));
console.log(app.verifyScopes(tokenContent2.scopes, 'profilehub::getVisitor'));
console.log(app.verifyScopes(tokenContent.scopes, 'profilehub::getRelease'));
console.log(app.verifyScopes(tokenContent6.scopes, 'profilehub::getToto'));

// var testPromise = app.verifyToken(accessToken);
// var testPromise2 = app.verifyToken(accessToken2);

// testPromise.then( function (tokenContent) {
// 	console.log(tokenContent);
// }).catch(function (err) {
// 	console.log(err);;
// });

// testPromise2.then( function (tokenContent) {
// 	console.log(tokenContent);
// }).catch(function (err) {
// 	console.log(err);;
// });
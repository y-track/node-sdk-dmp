var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_sept.key');
var privateKey2 = require('fs').readFileSync('./config/private_october.key');

var tokenContent = {
	account: "000002",
	appId: "fee8a312946c4a593046ed36d2",
	scopes: "toto"
};

var app = new SDK(conf["SDK"]);

var accessToken = app.signToken(tokenContent, privateKey);
var accessToken2 = app.signToken(tokenContent, privateKey2);

// console.log(app.checkAccountToken(accessToken, "000003"));
// console.log(app.checkAccountToken(accessToken, "000002"));
console.log("Good Token:");
console.log(accessToken);
console.log("Bad Token :")
console.log(accessToken2);

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
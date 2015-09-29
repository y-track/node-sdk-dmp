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

// good token
var accessToken = app.signToken(tokenContent, privateKey);
// bad token
var accessToken2 = app.signToken(tokenContent6, privateKey2);

var testPromise = app.verifyToken(accessToken);
var testPromise2 = app.verifyToken(accessToken2);

testPromise.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);;
});

testPromise2.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);;
});
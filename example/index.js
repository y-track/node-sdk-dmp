var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_sept.key');
var privateKey2 = require('fs').readFileSync('./config/private_october.key');

var tokenContent = {
	userId: 1,
	appId: 2,
	scopes: "toto"
};

var app = new SDK(conf["SDK"]);

var accessToken = app.signToken(tokenContent, privateKey);
var accessToken2 = app.signToken(tokenContent, privateKey2);

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
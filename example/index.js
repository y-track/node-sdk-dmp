var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var privateKey 	= require('fs').readFileSync('./config/private_october.key');

var tokenContent = {
	userId: 1,
	appId: 2,
	scopes: "toto"
};

var app = new SDK(conf);

var accessToken = app.signToken(tokenContent, privateKey);

var testPromise = app.verifyToken(accessToken);

testPromise.then( function (tokenContent) {
	console.log(tokenContent);
});
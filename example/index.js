var SDK	 		= require('../lib/index').SDK;
var conf 		= require('./config/config.json');
var fs          = require('fs');
var privateKey 	= fs.readFileSync('./config/private_august.key');
var publicKey 	= fs.readFileSync('./config/public_key_sept.pem');

var tokenContent = {
	userId: 1,
	appId: 2,
	scopes: "toto"
};

// var app = new SDK(conf);

// var accessToken = SDK.signToken(tokenContent, privateKey);

// var test = SDK.verifyToken(accessToken, conf);

// console.log(test.appId);

// console.log(cert);

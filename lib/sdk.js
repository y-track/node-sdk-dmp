var jwt = require('jsonwebtoken'),
	fs  = require('fs');

var SDK = {};

SDK.sortByDateDesc = function (a, b) {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}

SDK.getCurrentPublicKey = function(accessToken, conf) {

	var certificates = conf.certificates;

	certificates.sort(this.sortByDateDesc);
	
	for (var i = 0; i < certificates.length; i++) {
		
		var dateInTimestamp = new Date(certificates[i].date).getTime() / 1000;

		if (dateInTimestamp <= this.decodeIat(accessToken)) {
			return certificates[i].path;
		}
	}

}

SDK.signToken = function(tokenContent, cert) {
	return jwt.sign(tokenContent, cert, {algorithm: "RS256"});
}

SDK.decodeIat = function(accessToken) {
	return(jwt.decode(accessToken).iat);
}

SDK.verifyToken = function(accessToken, conf) {
	var cert = this.getCurrentPublicKey(accessToken, conf);
	
	var test = fs.readFileSync(cert);

	return jwt.verify(accessToken, test);
}

module.exports = SDK;
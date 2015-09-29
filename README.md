# node-sdk-dmp

### [30-09-2015] First Version

This first version allows to verify the validity of a token.

### Folder example

This folder contains an example application to test the SDK.

## Get Started

#### As soon ...
````
npm install sdk-dmp
````
#### To use 

````
var SdkConfig = require('path_of_file_config')["SDK"];
var sdk = new SDK(SdkConfig);
````

#### The config file :
````
{
    "SDK" : {
        "certificates": [
        	{
        		"path": "path_of_public_key",
        		"date": "2014-08-21 13:28:06"
        	},
        	{
        		"path": "path_of_another_public_key", 
        		"date": "2015-08-21 13:28:45"
        	}
        ]
    }

}
````

## Functions

### verifyToken(accessToken)
> Returns a promise token decoded if the signature are valid. If not, it will throw the error.

__Example :__
```
var test = sdk.verifyToken(accessToken);

test.then( function (tokenContent) {
	console.log(tokenContent);
}).catch(function (err) {
	console.log(err);;
});
```

### verifyScopes(scopesToken, scope)
> - scopesToken : In the content scopes token
> - scope : scope to compare

> Return true if scope is index of scopesToken else return false;

__Example :__
```
console.log(sdk.verifyScopes(accessTokenDecoded.scopes, 'an scope'));
```
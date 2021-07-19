
#  nodejs-server-maintenance

Express.js middleware to control server maintenance mode

##  Installation

    yarn add nodejs-server-maintenance

or

    npm install nodejs-server-maintenance
  
##  Usage

**Using default options**

    const maintenance = require('nodejs-server-maintenance');
    
    maintenance(app);

**Initializing maintenance mode to true**

    const maintenance = require('nodejs-server-maintenance');
    
    maintenance(app, true);

**Using customized configuration**

    const maintenance = require('nodejs-server-maintenance');
    
    // these are the default values
    
    const options = {
	    mode: false,
	    accessKey: "pw1234", // optional
	    endpoint: '/maintenance',
	    filePath: null,
	    useApi: false,
	    statusCode: 503,
	    message: 'Error 503: Server is temporarily unavailable, please try again lager.', // 503 is taken from statusCode
	    blockPost: false
    }
    
    maintenance(app, options);

**Setting maintenance mode on**

    POST request to http://yourserver/[endpoint]?access_key=[accessKey]
    
You can also customize the parameters sending a JSON with **the fields below** you want to change without changing your code (until the app restarts)

    {
        filePath: '...',
        useApi: false,
        statusCode: 503,
        message: '...',
        blockPost: false
	}

**Setting maintenance mode off**

    DELETE request to http://yourserver/[endpoint]?access_key=[accessKey]

In order to reset the customized parameters above, send the following JSON or restart the server

    {
        reset: true
	}

**Getting maintenance status**

    GET request to http://yourserver/[endpoint]/status
    
Response:

    {
        success: true,
        mode: true/false
	}

## Notes

 - accessKey is optional but is recommended to use
 - The maintenance should be defined before your app routes
 - The priority of the variables is
	 1. useApi - if `true` the server will send a JSON
	 2. filePath - if `filePath` is provided, the server will send that file
	 3. message - if above are `false` or `null`, the message will be sent by default


##  Variables

Name | Type | Description
------------ | ------------- | -------------
mode | Boolean | Sets maintenance mode on/off
accessKey | String | Allows access only using the access key
endpoint | String | The URL endpoint of the API requests
filePath | String | The path to the file to send (the default value is `null`)
message | String | A default message to display
useApi | Boolean | If true, the server will send JSON { statusCode, message }
statusCode | Number | Response status code
blockPost | Boolean | Blocks all POST requests, useful for mobile apps to prevent login/registration during maintenance
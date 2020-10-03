# nodejs-server-maintenance

Express.js middleware to control server maintenance mode

## Installation

    yarn add nodejs-server-maintenance

or

    npm install nodejs-server-maintenance

## Usage

Using default options

    const maintenance = require('nodejs-server-maintenance');
    
    maintenance(app);

Initializing maintenance mode to true

    const maintenance = require('nodejs-server-maintenance');
    
    maintenance(app, true);

Using customized configuration

    const maintenance = require('nodejs-server-maintenance');
    
    // these are the default values
    const options = {
        mode: false,        
        accessKey: '9a8db4cc9b3e1', // optional
        endpoint: '/maintenance',
        filePath: '/views/maintenance.html',
        forceMessage: false,       
        message: 'Error 503: Server is temporarily unavailable, please try again lager.',
        useApi: false,
        statusCode: 503,
        blockPost: false
    }
    
    maintenance(app, options);

Setting maintenance mode on

    POST request to http://yourserver/[endpoint]?access_key=[accessKey]


Setting maintenance mode off

    DELETE request to http://yourserver/[endpoint]?access_key=[accessKey]

Getting maintenance status

    GET requestion to http://yourserver/[endpoint]/status

> access_key is optional

## Variables

Name | Type | Description
------------ | ------------- | -------------
mode | Boolean | Sets maintenance mode on/off
accessKey | String | Allows access only using the access key
endpoint | String | The URL endpoint
filePath | String | The path to the HTML file
forceMessage | Boolean | Forces a simple message instead HTML
message | String | A simple message to display instead of HTML
useApi | Boolean | If true, the server will send JSON { statusCode, message }
statusCode | Number | Response status code
blockPost | Boolean | Blocks all POST requests, useful for app users to block login/registration
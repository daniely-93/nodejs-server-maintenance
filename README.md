# nodejs-server-maintenance

Express.js middleware to control server maintenance mode

## Installation

    yarn add nodejs-server-maintenance

or

    npm install nodejs-server-maintenance

## Usage

Using default options

    const maintenance = require('nodejs-server-maintencene');
    
    maintenance(app);

Initializing maintenance mode to true

    const maintenance = require('nodejs-server-maintencene');
    
    maintenance(app, true);

Using customized configuration

    const maintenance = require('nodejs-server-maintencene');
    
    const options = {
        mode: false,        // default value: false 
        accessKey: 'V1msnCX6',      // optional
        endpoint: '/maintenance',       // default value: /maintenance
        fileRoute: '/views/maintenance.html',       // default value: /views/maintenance.html
        forceMessage: false,        // default value: false
        message: 'Error 503: Server is temporarily unavailable, please try again lager.',       // default value: Error 503: Server is temporarily unavailable, please try again lager.
        useApi: false,      // default value: false
        statusCode: 503     // default value: 503
    }
    
    maintenance(app, options);

Setting maintenance mode on

    POST request to http://yourserver/[endpoint]?access_key=[accessKey]


Setting maintenance mode off

    DELETE request to http://yourserver/[endpoint]?access_key=[accessKey]

> Remove access_key query string if no accessKey provided

## Variables

Name | Type | Description
------------ | ------------- | -------------
mode | Boolean | Sets maintenance mode on/off
accessKey | String | Allows access only using the access key
endpoint | String | Defines the requestion route after the domain
fileRoute | String | Sets the route to the HTML file that the server will send when mode is on
forceMessage | Boolean | Forces a simple message instead of using HTML file
message | String | A simple message to display instead of HTML
useApi | Boolean | If true, the server will send JSON { statusCode, message }
statusCode | Number | Response status code
/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

var express = require( 'express' );
var loader  = require( 'express-load' );
var moment = require('moment-timezone');

// Create the main express app
var app = module.exports = express();

require( './boot' )( app, function() {
    loader( 'lib' )
	.then( 'models' )
	.then( 'collections' )
	.then( 'controllers' )
	.then( 'routes' )
	.into( app );
    app.listen( app.get( 'port' ), function() {
	   	console.log('web server listening on port ' + app.get('port'));
    });
});

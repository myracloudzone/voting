/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/
var mysql = require('mysql');
var config = require('./config.json');
var connection = mysql.createConnection(config.connConfig.connection);
connection.connect(function (err) {
	if (err)
		throw err;
	console.log("------------------------------Connected--------------------------------");
});

module.exports = connection;
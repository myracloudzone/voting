/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

var https = require('https');
var connection = require('../scripts/db.js');
var config = require('../scripts/config.json');
var commonUtils = require("../lib/CommonUtils.js");
var connectionParameter = config.connConfig.connection;

module.exports = {
	makeDBRequestAsync : function(queryObject) {
		return new Promise(async function(resolve, reject) {
			connection.query('use '+connectionParameter.database);
			connection.query(queryObject, function(err, result) {
				if(err) {
					resolve(commonUtils.getDAOResponseMsg(err, null, 500));
				} else {
					resolve(commonUtils.getDAOResponseMsg(null, result, 200));
				}
			});
		}); 	
	}
};
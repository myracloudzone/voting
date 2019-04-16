/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

var winston = require('winston')
var config = require('../scripts/config.json')
module.exports = {
    logger: new(winston.Logger)({
        transports: [
            new(winston.transports.Console)(),
            new(winston.transports.File)({
                filename: config.logFile
            })
        ]
    })
}
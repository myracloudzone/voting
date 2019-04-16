/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

var logger = require('./Logger.js').logger;
module.exports = {
    logResponse : function(url, statusCode, response, error, requestResponseObject) {
        if(error) {
            logger.error("*****************************************--Warning Messagae--***********************************************");
            logger.error("--Request Url : ", url);
            logger.error("--Date : ", new Date());
            logger.error("--Status Code : ", statusCode);
            logger.error("--Cause : ");
            logger.error(error);
        } else {
            logger.info("******************************************--Info Messagae--***********************************************");
            logger.info("--Request Url : ", url);
            logger.info("--Date : ", new Date());
            logger.info("--Status Code : ", statusCode);
            logger.info("--Response : ")
            ;
            logger.info(response);
        } 
        logger.info("******************************************--------------------***********************************************");
        return requestResponseObject.status(statusCode).send(response);
    },
    info : function(log) {
        logger.info(log);
    },
    error : function(log) {
        logger.error(log);
    }
}
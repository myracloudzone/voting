/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

'use strict';
const nodeMailer = require('nodemailer');
var config = require('../scripts/config.json');
var commonUtils = require("../lib/CommonUtils.js");

let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.mail.username,
        pass: config.mail.password
    }
});
let mailOptions = {
    from: config.mail.from,
    to: '', 
    html: ''
};
module.exports = {
    sendHTMLEmail : function(toAddress, message, subject) {
        return new Promise(function(resolve, reject) {
            mailOptions.to = toAddress;
            mailOptions.html = message;
            mailOptions.subject = subject;
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    resolve(commonUtils.getDAOResponseMsg(error, null, 500));
                } else {
                    resolve(commonUtils.getDAOResponseMsg(null, info, 200));
                }
            });
        });
    }
}    

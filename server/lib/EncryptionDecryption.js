/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'AAAA-TTS-111';
module.exports = {
	encrypt : function(text) {
		var cipher = crypto.createCipher(algorithm, password)
		var crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex');
		return crypted;
	},

	encryptWithKey : function(text, encryptKey) {
		var cipher = crypto.createCipher(algorithm, encryptKey)
		var crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex');
		return crypted;
	},

	decrypt : function(text) {
		var decipher = crypto.createDecipher(algorithm, password)
		var dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8');
		return dec;
	},

	decryptWithKey : function(text, decyptKey) {
		var decipher = crypto.createDecipher(algorithm, decyptKey)
		var dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8');
		return dec;
	}
};
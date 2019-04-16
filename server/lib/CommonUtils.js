/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailakkiy@gmail.com
*/

var moment = require('moment-timezone');
module.exports = {
	getIsCookieSecure: function () {
		return global.cookieSecure;
	},

	setIsCookieSecure: function (secureFlag) {
		global.cookieSecure = secureFlag;
	},

	setCookie: function (name, value, maxAge, httpOnly, secure, res) {
		res.cookie(name, value, {
			maxAge: maxAge,
			httpOnly: httpOnly,
			secure: secure
		});
		return;
	},

	removeAllSpecialCharacterFromFileName: function (stringToReplace) {
		var tmp = stringToReplace.substring(0, stringToReplace.lastIndexOf('.'));
		var desired = tmp.replace(/[^\w\s]/gi, '');
		desired = desired.replace(/ /g, "");
		desired = desired + stringToReplace.substring(stringToReplace.lastIndexOf('.'), stringToReplace.length);
		return desired;
	},

	getCookies: function (cookies) {
		if (cookies == null) {
			return {};
		}
		var data = {};
		var allCookies = cookies.split('; ');
		for (cook in allCookies) {
			cook = allCookies[cook];
			if (cook != null) {
				var key = cook.substring(0, cook.indexOf('='));
				var value = cook.substring(cook.indexOf('=') + 1, cook.length);
				data[key] = value;
			}
		}
		return data;
	},

	checkObjectType: function (object) {
		var stringConstructor = "test".constructor;
		var arrayConstructor = [].constructor;
		var objectConstructor = {}.constructor;
		if (object === null) {
			return "null";
		} else if (object === undefined) {
			return "undefined";
		} else if (object.constructor === stringConstructor) {
			return "String";
		} else if (object.constructor === arrayConstructor) {
			return "Array";
		} else if (object.constructor === objectConstructor) {
			return "Object";
		} else {
			return "Unknown";
		}
	},

	getQueryPageObject: function (req) {
		var pageObject = {
			page: 1,
			pageSize: 10
		};
		if (req != null) {
			pageObject.page = req.query.page != null ? req.query.page : 1;
			pageObject.pageSize = req.query.pageSize != null ? req.query.pageSize : 10;
		}
		return pageObject;
	},

	getDAOResponseMsg: function (error, result, statusCode) {
		var response = {};
		response.error = error;
		response.result = result;
		response.statusCode = statusCode;
		return response;
	},

	getNumericUniqueCode: function (length) {
		var text = "";
		var combination = "0123456789";
		for (var i = 0; i < length; i++) {
			text += combination.charAt(Math.floor(Math.random() * combination.length));
		}
		return text;
	},

	getUniqueCode: function (length) {
		var text = "";
		var combination = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var i = 0; i < length; i++) {
			text += combination.charAt(Math.floor(Math.random() * combination.length));
		}
		return text;
	}
};
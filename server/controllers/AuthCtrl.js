var schema = require('bookshelf').DB;
var Deferred = require('promised-io/promise').Deferred;
var async = require('async');
var encryptionService = require("../lib/EncryptionDecryption.js");
var logger = require("../lib/AdvancedLogger.js");
var commonUtils = require("../lib/CommonUtils.js");
var errorCodes = require("../scripts/ErrorCodes.json");
const uuidv1 = require('uuid/v1');
var moment = require('moment-timezone');
var userDAO = require("../dao/UserDAO.js");
var voterDAO = require("../dao/VoterDAO.js");
var mailer = require("../lib/Mailer.js");
var fs = require('fs');
var loginUtility = require("../modelUtilities/LoginUtility.js");
var rolesMap = require('../scripts/roles.json');

module.exports = function (app) {
	var controller = {};

	controller.authenticate = async function (req, res, next) {
		var validResult = loginUtility.isValidLogin(req.body);
		if (!validResult.isValid) {
			return logger.logResponse(req.url, 400, validResult.message, validResult.message, res);
		}
		var loginResult = await userDAO.findByUsername(req.body.username);
		if (loginResult.statusCode != 200) {
			return logger.logResponse(req.url, loginResult.statusCode, errorCodes.USERNAME_NOT_EXIST, loginResult.error, res);
		} else {
			var data = loginResult.result;
			if (data.password != encryptionService.encrypt(req.body.password)) {
				return logger.logResponse(req.url, 404, errorCodes.INVALID_USERNAME_PASSWORD, errorCodes.INVALID_USERNAME_PASSWORD, res);
			}
			/* ------ Update Session Object ------ */
			var sessionObj = {};
			sessionObj.id = uuidv1();
			sessionObj.username = req.body.username;
			sessionObj.lastHit = (new Date()).getTime();
			sessionObj.active = 1;
			sessionObj.uuid = uuidv1();
			sessionObj.role = data.role;
			sessionObj.voterId = data.voterId;
			var encryptedUUID = req.headers.uuid = encryptionService.encrypt(sessionObj.uuid);
			commonUtils.setCookie('session.tag', encryptedUUID, (Number(10) * 60 * 1000) + (1 * 60 * 60 * 1000), true, commonUtils.getIsCookieSecure(), res);
			var sessionResult = await userDAO.createNewUserSession(sessionObj);
			if (sessionResult.statusCode != 200) {
				return logger.logResponse(req.url, sessionResult.statusCode, null, sessionResult.error, res);
			}
			return logger.logResponse(req.url, 200, {
				UUID: encryptedUUID
			}, null, res);
		}
	}

	controller.logout = async function (req, res, next) {
		if (req.headers.uuid == null) {
			return logger.logResponse(req.url, 400, "UUID is required.", "UUID is required.", res);
		}
		var logoutResult = await userDAO.invalideSession(req.headers.uuid);
		if (logoutResult.statusCode != 200) {
			return logger.logResponse(req.url, logoutResult.statusCode, null, logoutResult.error, res);
		}
		commonUtils.setCookie('session.tag', 'Expired', (10 * 1000), true, commonUtils.getIsCookieSecure(), res);
		logger.logResponse(req.url, 200, {
			data: "Logged Out Successfully."
		}, null, res);
	}

	controller.getLoggedInMember = async function (req, res, next) {
		var voterId = req.headers['voterId'];
		var obj = {};
		if (voterId == '0' || voterId == 0 || voterId == null || voterId == '') {
			obj.firstName = 'System';
			obj.lastName = 'Admin';
			obj.email = 'admin@votingio.com';
			obj.allowedRoles = rolesMap[req.headers['role']];
			return logger.logResponse(req.url, 200, obj, null, res);
		}
		var voterObject = await voterDAO.findById(voterId);
		if (voterObject.statusCode != 200) {
			return logger.logResponse(req.url, voterObject.statusCode, voterObject.error, voterObject.error, res);
		}
		voterObject = voterObject.result;
		obj.name = voterObject.name;
		obj.email = voterObject.email;
		obj.allowedRoles = rolesMap[req.headers['role']];
		logger.logResponse(req.url, 200, obj, null, res);
	};

	controller.isValidSession = async function (req, res, next) {
		var cookies = commonUtils.getCookies(req.headers.cookie);
		req.headers.uuid = cookies['session.tag'];
		if (req.headers.uuid == null || req.headers.uuid == '' || req.headers.uuid == undefined || req.headers.uuid == 'Expired') {
			return logger.logResponse(req.url, 200, {
				status: false
			}, null, res);
		}
		req.headers.uuid = encryptionService.decrypt(req.headers.uuid);
		schema.model('UserSession').forge().where({
			uuid: req.headers.uuid,
			active: 1
		}).query(function (qb) {
			qb.debug(false)
		}).fetch().then(function (data) {
			if (data) {
				return logger.logResponse(req.url, 200, {
					status: true
				}, null, res);
			} else {
				commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
				return logger.logResponse(req.url, 200, {
					status: false
				}, null, res);
			}
		}).catch(function (err) {
			commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
			return logger.logResponse(req.url, 200, {
				status: false
			}, null, res);
		})
	}
	return controller;
}
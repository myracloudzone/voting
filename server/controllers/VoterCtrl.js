var async = require('async');
var encryptionService = require("../lib/EncryptionDecryption.js");
var logger = require("../lib/AdvancedLogger.js");
var commonUtils = require("../lib/CommonUtils.js");
const uuidv1 = require('uuid/v1');
var moment = require('moment-timezone');
var errorCodes = require("../scripts/ErrorCodes.json");
var mailer = require("../lib/Mailer.js");
var fs = require('fs');
var voterUtility = require("../modelUtilities/VoterUtility.js");
var userUtility = require("../modelUtilities/UserUtility.js");
var voterDAO = require("../dao/VoterDAO.js");
var userDAO = require("../dao/UserDAO.js");
var rolesMap = require('../scripts/roles.json');

module.exports = function (app) {
	var controller = {};

	controller.createVoter = async function (req, res, next) {
		if (rolesMap[req.headers.role]['votersAPI'] != true) {
			return logger.logResponse(req.url, 403, {
				message: "Not Authorized."
			}, "Not Authorized.", res);
		}
		var validResult = await voterUtility.isValidCreate(req.body);
		if (!validResult.isValid) {
			return logger.logResponse(req.url, 400, validResult.message, validResult.message, res);
		}
		var emailCheckResult = await voterDAO.findByEmail(req.body.email);
		if (emailCheckResult.statusCode == 200) {
			return logger.logResponse(req.url, 400, {
				message: "Email already in used."
			}, "Email already in used.", res);
		}
		var voterEntity = voterUtility.voterDTOToEntity(req.body);
		var result = await voterDAO.save(voterEntity);
		if (result.statusCode != 200) {
			return logger.logResponse(req.url, result.statusCode, result.error, null, res);
		}
		var userEntity = userUtility.createNewUserEntity(result.result.id, req.body.email, "USER");
		var message = "<h5>Your password is " + userEntity.originalPassword + ".";
		delete userEntity.originalPassword;
		userEntity = await userDAO.save(userEntity);
		if (userEntity.statusCode != 200) {
			console.log(userEntity.error);
		}
		mailer.sendHTMLEmail(userEntity.result.email, message, "Password");
		return logger.logResponse(req.url, 200, {
				data: result.result
			},
			null,
			res
		)
	}

	controller.updateVoter = async function (req, res, next) {
		if (rolesMap[req.headers.role]['votersAPI'] != true) {
			return logger.logResponse(req.url, 403, {
				message: "Not Authorized."
			}, "Not Authorized.", res);
		}
		var validResult = await voterUtility.isValidCreate(req.body);
		if (!validResult.isValid) {
			return logger.logResponse(req.url, 400, validResult.message, validResult.message, res);
		}
		var emailCheckResult = await voterDAO.findByEmail(req.body.email);
		if (emailCheckResult.statusCode == 200 && emailCheckResult.result.id != req.body.id) {
			return logger.logResponse(req.url, 400, {
				message: "Email already in used."
			}, "Email already in used.", res);
		}
		var voterEntity = voterUtility.voterDTOToEntity(req.body);
		var result = await voterDAO.updateById(voterEntity);
		if (result.statusCode != 200) {
			return logger.logResponse(req.url, result.statusCode, result.error, null, res);
		}
		return logger.logResponse(req.url, 200, {
				data: result.result
			},
			null,
			res
		)
	}

	controller.list = async function (req, res, next) {
		var result = await voterDAO.findAll();
		if (result.statusCode != 200) {
			return logger.logResponse(req.url, result.statusCode, result.error, null, res);
		}
		return logger.logResponse(req.url, 200, {
				data: result.result
			},
			null,
			res
		)
	}

	controller.deleteById = async function (req, res, next) {
		if (rolesMap[req.headers.role]['votersAPI'] != true) {
			return logger.logResponse(req.url, 403, {
				message: "Not Authorized."
			}, "Not Authorized.", res);
		}
		var obj = {};
		obj.id = req.body.id;
		obj.active = false;
		var result = await voterDAO.updateById(obj);
		if (result.statusCode != 200) {
			return logger.logResponse(req.url, result.statusCode, result.error, null, res);
		}
		var username = result.result.email;
		var obj = {
			username: username,
			active: 0
		};
		await userDAO.updateByUsername(obj);
		return logger.logResponse(req.url, 200, {
				data: "Deleted Successfully."
			},
			null,
			res
		)
	}
	return controller;
}
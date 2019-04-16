var async = require('async');
var encryptionService = require("../lib/EncryptionDecryption.js");
var logger = require("../lib/AdvancedLogger.js");
var commonUtils = require("../lib/CommonUtils.js");
const uuidv1 = require('uuid/v1');
var moment = require('moment-timezone');
var errorCodes = require("../scripts/ErrorCodes.json");
var mailer = require("../lib/Mailer.js");
var fs = require('fs');
var partyUtility = require("../modelUtilities/PartyUtility.js");
var partyDAO = require("../dao/PartyDAO.js");
var rolesMap = require('../scripts/roles.json');

module.exports = function (app) {
	var controller = {};

	controller.create = async function (req, res, next) {
		if (rolesMap[req.headers.role]['partiesAPI'] != true) {
			return logger.logResponse(req.url, 403, "Not Authorized.", "Not Authorized.", res);
		}
		var validResult = await partyUtility.isValidCreate(req.body);
		if (!validResult.isValid) {
			return logger.logResponse(req.url, 400, validResult.message, validResult.message, res);
		}
		var codeCheckResult = await partyDAO.findByCode(req.body.code);
		if (codeCheckResult.statusCode == 200) {
			return logger.logResponse(req.url, 400, "Code already in used.", "Code already in used.", res);
		}
		var partyEntity = partyUtility.partyDTOToEntity(req.body);
		var result = await partyDAO.save(partyEntity);
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

	controller.update = async function (req, res, next) {
		if (rolesMap[req.headers.role]['partiesAPI'] != true) {
			return logger.logResponse(req.url, 403, "Not Authorized.", "Not Authorized.", res);
		}
		var validResult = await partyUtility.isValidCreate(req.body);
		if (!validResult.isValid) {
			return logger.logResponse(req.url, 400, validResult.message, validResult.message, res);
		}
		var codeCheckResult = await partyDAO.findByCode(req.body.code);
		if (codeCheckResult.statusCode == 200 && codeCheckResult.result.id != req.body.id) {
			return logger.logResponse(req.url, 400, "Code already in used.", "Code already in used.", res);
		}
		var partyEntity = partyUtility.partyDTOToEntity(req.body);
		var result = await partyDAO.updateById(partyEntity);
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
		var result = await partyDAO.findAll();
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
		if (rolesMap[req.headers.role]['partiesAPI'] != true) {
			return logger.logResponse(req.url, 403, "Not Authorized.", "Not Authorized.", res);
		}
		var obj = {};
		obj.id = req.body.id;
		obj.active = false;
		var result = await partyDAO.updateById(obj);
		if (result.statusCode != 200) {
			return logger.logResponse(req.url, result.statusCode, result.error, null, res);
		}
		return logger.logResponse(req.url, 200, {
				data: "Deleted Successfully."
			},
			null,
			res
		)
	}
	return controller;
}
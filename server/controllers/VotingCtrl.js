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
var votingUtility = require("../modelUtilities/VotingUtility.js");
var voterDAO = require("../dao/VoterDAO.js");
var userDAO = require("../dao/UserDAO.js");
var votingDAO = require("../dao/VotingDAO.js");

module.exports = function (app) {
	var controller = {};

	controller.applyVote = async function (req, res, next) {
		var voterId = req.headers.voterId;
		if (voterId == null) {
			return logger.logResponse(req.url, 400, {
				message: "Not allowed for voting."
			}, "Not allowed for voting.", res);
		}
		var votingResult = await votingDAO.findByVoterId(voterId);
		if (votingResult.statusCode == 200) {
			return logger.logResponse(req.url, 400, {
				message: "You have already given your vote."
			}, "You have already given your vote.", res);
		}
		var obj = {};
		var votingEntity = votingUtility.createVoting(voterId, req.body.memberId);
		var votingResult = await votingDAO.save(votingEntity);
		if (votingResult.statusCode != 200) {
			return logger.logResponse(req.url, votingResult.statusCode, votingResult.error, null, res);
		}
		return logger.logResponse(req.url, votingResult.statusCode, {
			message: "Vote Applied Successfully."
		}, "Vote Applied Successfully.", res);
	}

	controller.checkForVoting = async function (req, res, next) {
		var voterId = req.headers.voterId;
		if (voterId == null) {
			return logger.logResponse(req.url, 400, {
				message: "Not allowed for voting.",
				isAllowed: false
			}, "Not allowed for voting.", res);
		}
		var votingResult = await votingDAO.findByVoterId(voterId);
		if (votingResult.statusCode == 200) {
			return logger.logResponse(req.url, 400, {
				message: "You have already given your vote.",
				isAllowed: false
			}, "You have already given your vote.", res);
		}
		return logger.logResponse(req.url, 200, {
			message: "Allowed for voting.",
			isAllowed: true
		}, "You have already given your vote.", res);
	}

	controller.getVotingResult = async function (req, res, next) {
		var votingResult = await votingDAO.getVotingResult();
		if (votingResult.statusCode != 200) {
			return logger.logResponse(req.url, votingResult.statusCode, votingResult.error, null, res);
		}
		return logger.logResponse(req.url, 200, {
			data: votingResult.result
		}, votingResult.result.rows, res);
	}
	return controller;
}
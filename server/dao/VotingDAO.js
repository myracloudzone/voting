/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailto:akshay.soni@habilelabs.io
*/

var schema = require('bookshelf').DB;
var async = require('async');
var commonUtils = require("../lib/CommonUtils.js");
var connectionDAO = require("./ConnectionDAO.js");
module.exports = {
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            schema.model('Voting').forge().save(obj).then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("Unknown Error occurred while saving.", null, 404));
                }
                resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
    findByVoterId: function (voterId) {
        return new Promise(function (resolve, reject) {
            schema.model('Voting').forge().query(function (qb) {
                qb.where('voterId', voterId)
            }).fetch().then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("No Record Found.", null, 404));
                } else {
                    resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
                }
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
    findAll: function () {
        return new Promise(function (resolve, reject) {
            schema.model('Voting').forge().query(function (qb) {
                qb.where('active', 1)
            }).fetchAll().then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("No Record Found.", null, 404));
                } else {
                    resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
                }
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
    getVotingResult: function () {
        return new Promise(async function (resolve, reject) {
            var sql = "select count(p.id) as countNumber, p.code from polling.Voting v inner join polling.PartyMember pm on (pm.id = v.partyMemberId) " +
                "left join polling.party p on (p.id = pm.partyId) group by p.id";
            var result = await connectionDAO.makeDBRequestAsync(sql);
            if (result.statusCode != 200) {
                resolve(commonUtils.getDAOResponseMsg(result.error, null, result.statusCode));
            } else {
                resolve(commonUtils.getDAOResponseMsg(null, result.result, 200));
            }
        });
    }
}
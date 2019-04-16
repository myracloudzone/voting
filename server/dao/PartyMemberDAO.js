/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailto:akshay.soni@habilelabs.io
*/

var schema = require('bookshelf').DB;
var async = require('async');
var commonUtils = require("../lib/CommonUtils.js");

module.exports = {
    save: function (obj) {
        return new Promise(function (resolve, reject) {
            schema.model('PartyMember').forge().save(obj).then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("Unknown Error occurred while saving.", null, 404));
                }
                resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
    findById: function (id) {
        return new Promise(function (resolve, reject) {
            schema.model('PartyMember').forge().query(function (qb) {
                qb.innerJoin("Party", function () {
                        this.on("PartyMember.partyId", "=", "party.id");
                    }).where('PartyMember.active', 1)
                    .andWhere('PartyMember.id', id)
                    .column('PartyMember.*', 'Party.symbol as partySymbol', 'Party.active as partyActive', 'Party.id as partyId', 'Party.name as partyName', 'Party.code as partyCode', 'Party.symbol as partySymbol')
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
    findByCode: function (code) {
        return new Promise(function (resolve, reject) {
            schema.model('PartyMember').forge().query(function (qb) {
                qb.where('code', code)
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
            schema.model('PartyMember').forge().query(function (qb) {
                qb.innerJoin("Party", function () {
                        this.on("PartyMember.partyId", "=", "party.id");
                    }).where('PartyMember.active', 1)
                    .column('PartyMember.*', 'Party.symbol as partySymbol', 'Party.active as partyActive', 'Party.id as partyId', 'Party.name as partyName', 'Party.code as partyCode', 'Party.symbol as partySymbol')
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
    updateById: function (obj) {
        return new Promise(function (resolve, reject) {
            schema.model('PartyMember').forge().where({
                id: obj.id
            }).fetch().then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("No record found.", null, 404));
                } else {
                    result.save(obj, {
                        method: 'update',
                        patch: true,
                        require: false
                    }).then(function (savedObject) {
                        if (savedObject != null) {
                            resolve(commonUtils.getDAOResponseMsg(null, savedObject.toJSON(), 200));
                        } else {
                            resolve(commonUtils.getDAOResponseMsg("Unknown Error Occurred.", null, 500));
                        }
                    }).catch(function (err) {
                        resolve(commonUtils.getDAOResponseMsg(err, null, 500));
                    })
                }
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            });
        });
    },
}
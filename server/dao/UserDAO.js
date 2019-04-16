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
            schema.model('User').forge().save(obj).then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("Unknown Error occurred while saving.", null, 404));
                }
                resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
    updateById: function (obj) {
        return new Promise(function (resolve, reject) {
            schema.model('User').forge().where({
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
    updateUserByUsername: function (obj) {
        return new Promise(function (resolve, reject) {
            schema.model('User').forge().where({
                username: obj.username,
                active: true
            }).fetch().then(function (data) {
                if (data) {
                    data.save(obj, {
                        method: 'update',
                        patch: true
                    }).then(function (result) {
                        resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
                    });
                } else {
                    resolve(commonUtils.getDAOResponseMsg("No Record Found.", null, 404));
                }
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        })
    },
    updateByUsername: function (obj) {
        return new Promise(function (resolve, reject) {
            schema.model('User').forge().where({
                username: obj.username
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
    createNewUserSession: function (sessionObj) {
        return new Promise(function (resolve, reject) {
            schema.model('UserSession').forge().save(sessionObj).then(function (result) {
                if (result != null) {
                    resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
                } else {
                    resolve(commonUtils.getDAOResponseMsg("Unkown Error Occurred While Saving.", null, 500));
                }
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
    invalideSession: function (UUID) {
        return new Promise(function (resolve, reject) {
            schema.model('UserSession').forge().where({
                uuid: UUID,
                active: true
            }).fetch().then(function (data) {
                if (data) {
                    var userSession = data.toJSON();
                    userSession.active = false;
                    data.save(userSession, {
                        method: 'update',
                        patch: true
                    }).then(function (result) {
                        resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
                    });
                } else {
                    resolve(commonUtils.getDAOResponseMsg("No Record Found.", null, 404));
                }
            }).catch(function (err) {
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        })
    },
    findByUsername: function (username) {
        return new Promise(function (resolve, reject) {
            schema.model('User').forge().query(function (qb) {
                qb.where('username', username)
                    .andWhere('active', 1)
            }).fetch().then(function (result) {
                if (result == null) {
                    resolve(commonUtils.getDAOResponseMsg("No Record Found.", null, 404));
                } else {
                    resolve(commonUtils.getDAOResponseMsg(null, result.toJSON(), 200));
                }
            }).catch(function (err) {
                console.log("Error Occurred ", err)
                resolve(commonUtils.getDAOResponseMsg(err, null, 500));
            })
        });
    },
}
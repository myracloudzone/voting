var moment = require("moment-timezone");
var async = require("async");
const uuidv1 = require("uuid/v1");
var encryptionService = require("../lib/EncryptionDecryption.js");
var commonUtils = require("../lib/CommonUtils.js");

module.exports = {
    createNewUserEntity: function (voterId, email, roleId) {
        var code = commonUtils.getUniqueCode(6);
        var password = encryptionService.encrypt(code);
        var obj = {};
        obj.id = uuidv1();
        obj.email = email;
        obj.username = email;
        obj.password = password;
        obj.originalPassword = code;
        obj.active = 1;
        obj.role = roleId;
        obj.voterId = voterId;
        return obj;
    }
};
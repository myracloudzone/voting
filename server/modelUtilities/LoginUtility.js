var moment = require('moment-timezone');
var moment = require('moment');
var async = require('async');
var errorCodes = require("../scripts/ErrorCodes.json");

module.exports = {
    isValidLogin: function (loginDTO) {
        var result = {
            message: "",
            isValid: true
        };
        if (loginDTO.username == null || loginDTO.username.trim().length == 0) {
            result.message = errorCodes.USERNAME_REQUIRED;
            result.isValid = false;
            return result;
        }
        if (loginDTO.username.trim().length > 50) {
            result.message = errorCodes.USERNAME_VALID;
            result.isValid = false;
            return result;
        }
        if (loginDTO.password == null || loginDTO.password.trim().length == 0) {
            result.message = errorCodes.PASSWORD_REQUIRED;;
            result.isValid = false;
            return result;
        }
        if (loginDTO.password.trim().length > 15) {
            result.message = errorCodes.PASSWORD_VALID;
            result.isValid = false;
            return result;
        }
        return result;
    }
};
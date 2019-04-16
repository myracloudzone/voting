var moment = require("moment-timezone");
var async = require("async");
const uuidv1 = require("uuid/v1");

module.exports = {
    partyEntityToDTO: function (entity) {
        var obj = {};
        obj.id = entity.id;
        obj.name = entity.name;
        obj.code = entity.code;
        obj.symbol = entity.symbol;
        obj.active = entity.active;
        return obj;
    },
    partyDTOToEntity: function (partyDTO, auditTime) {
        var obj = {};
        obj.id = partyDTO.id != null ? partyDTO.id : uuidv1();
        obj.name = partyDTO.name;
        obj.code = partyDTO.code;
        obj.symbol = partyDTO.symbol;
        obj.active = partyDTO.active == null ? 1 : partyDTO.active;
        return obj;
    },
    isValidCreate: function (partyDTO) {
        return new Promise(async function (resolve, reject) {
            var result = {
                message: "",
                isValid: true
            };
            if (partyDTO.name == null || partyDTO.name.trim().length == 0) {
                result.message = {
                    message: "Name is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyDTO.name.trim().length > 100) {
                result.message = {
                    message: "Name should be maximum of 100 character."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyDTO.code == null || partyDTO.code.trim().length == 0) {
                result.message = {
                    message: "Code is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyDTO.code.trim().length > 50) {
                result.message = {
                    message: "Code should be maximum of 50 character."
                };
                result.isValid = false;
                return resolve(result);
            }
            return resolve(result);
        });
    }
};
var moment = require("moment-timezone");
var async = require("async");
const uuidv1 = require("uuid/v1");

module.exports = {
    voterEntityToDTO: function (entity) {
        var obj = {};
        obj.id = entity.id;
        obj.name = entity.name;
        obj.email = entity.email;
        obj.active = entity.active;
        return obj;
    },
    voterDTOToEntity: function (voterDTO, auditTime) {
        var obj = {};
        obj.id = voterDTO.id != null ? voterDTO.id : uuidv1();
        obj.name = voterDTO.name;
        obj.email = voterDTO.email;
        obj.active = voterDTO.active == null ? 1 : voterDTO.active;
        return obj;
    },
    isValidCreate: function (voterDTO) {
        return new Promise(async function (resolve, reject) {
            var result = {
                message: "",
                isValid: true
            };
            if (voterDTO.name == null || voterDTO.name.trim().length == 0) {
                result.message = {
                    message: "Name is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (voterDTO.name.trim().length > 100) {
                result.message = {
                    message: "Name should be maximum of 100 character."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (voterDTO.email == null || voterDTO.email.trim().length == 0) {
                result.message = {
                    message: "Email is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (voterDTO.email.trim().length > 50) {
                result.message = {
                    message: "Email should be maximum of 50 character."
                };
                result.isValid = false;
                return resolve(result);
            }
            return resolve(result);
        });
    }
};
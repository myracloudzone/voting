var moment = require("moment-timezone");
var async = require("async");
const uuidv1 = require("uuid/v1");
var partyDAO = require("../dao/PartyDAO.js");

module.exports = {
    partyMemberEntityToDTO: async function (entity) {
        var obj = {};
        obj.id = entity.id;
        obj.name = entity.name;
        obj.code = entity.code;
        obj.party = {};
        if (entity.partyId != null) {
            var party = await partyDAO.findById(entity.partyId);
            if (party.statusCode == 200) {
                obj.party = party.result;
            }
        }
        return obj;
    },
    partyMemberDTOToEntity: function (partyMemberDTO, auditTime) {
        var obj = {};
        obj.id = partyMemberDTO.id != null ? partyMemberDTO.id : uuidv1();
        obj.name = partyMemberDTO.name;
        obj.code = partyMemberDTO.code;
        obj.partyId = partyMemberDTO.party.id;
        obj.active = partyMemberDTO.active == null ? 1 : partyMemberDTO.active;
        return obj;
    },
    isValidCreate: function (partyMemberDTO) {
        return new Promise(async function (resolve, reject) {
            var result = {
                message: "",
                isValid: true
            };
            if (partyMemberDTO.name == null || partyMemberDTO.name.trim().length == 0) {
                result.message = {
                    message: "Name is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyMemberDTO.name.trim().length > 100) {
                result.message = {
                    message: "Name should be maximum of 100 character."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyMemberDTO.code == null || partyMemberDTO.code.trim().length == 0) {
                result.message = {
                    message: "Code is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyMemberDTO.code.trim().length > 50) {
                result.message = {
                    message: "Code should be maximum of 50 character."
                };
                result.isValid = false;
                return resolve(result);
            }
            if (partyMemberDTO.party == null || partyMemberDTO.party.id == null) {
                result.message = {
                    message: "Party is required."
                };
                result.isValid = false;
                return resolve(result);
            }
            return resolve(result);
        });
    }
};
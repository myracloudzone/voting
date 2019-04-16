var moment = require("moment-timezone");
var async = require("async");
const uuidv1 = require("uuid/v1");

module.exports = {
    createVoting: function (voterId, memberId) {
        var obj = {};
        obj.id = uuidv1();
        obj.partyMemberId = memberId;
        obj.voterId = voterId;
        obj.dateCreated = moment().unix();
        return obj;
    }
};
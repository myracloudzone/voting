/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailto: mailakkiy@gmail.com
*/

module.exports = function (app) {
	var partyMemberCtrl = app.controllers.PartyMemberCtrl;
	app.post('/party-member/create', partyMemberCtrl.create);
	app.get('/party-member/list', partyMemberCtrl.list);
	app.post('/party-member/update', partyMemberCtrl.update);
	app.post('/party-member/delete', partyMemberCtrl.deleteById);
};
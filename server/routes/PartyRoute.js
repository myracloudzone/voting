/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailto: mailakkiy@gmail.com
*/

module.exports = function (app) {
	var partyCtrl = app.controllers.PartyCtrl;
	app.post('/party/create', partyCtrl.create);
	app.get('/party/list', partyCtrl.list);
	app.post('/party/update', partyCtrl.update);
	app.post('/party/delete', partyCtrl.deleteById);
};
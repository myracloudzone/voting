/*  
	Copyright © 2018-2020 by Akshay Soni
	Developed by Akshay Soni
	Mail: mailto: mailakkiy@gmail.com
*/

module.exports = function (app) {
	var voterCtrl = app.controllers.VoterCtrl;
	var votingCtrl = app.controllers.VotingCtrl;
	app.post('/voter/create', voterCtrl.createVoter);
	app.get('/voter/list', voterCtrl.list);
	app.post('/voter/update', voterCtrl.updateVoter);
	app.post('/voter/delete', voterCtrl.deleteById);
	app.post('/voter/postVote', votingCtrl.applyVote);
	app.get('/voter/checkForVoting', votingCtrl.checkForVoting);
	app.get('/voter/getVotingResult', votingCtrl.getVotingResult);
};
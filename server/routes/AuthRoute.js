module.exports = function (app) {
    var auth = app.controllers.AuthCtrl;
    app.post('/auth/authenticate', auth.authenticate);
    app.post('/auth/logout', auth.logout);
    app.post('/auth/isValidSession', auth.isValidSession);
    app.get('/auth/getLoggedInMember', auth.getLoggedInMember);
};
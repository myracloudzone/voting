global.UUIDEncryptKey = "LETS_BREAK_IT";
global.commonEncryptKey = "LETS_MERGE_IT";
global.dateFormat = "MM/DD/YYYY";
module.exports = function (app, cb) {
    var express = require('express');
    var path = require('path');
    var util = require('util');
    var passport = require('passport');
    var SessionStore = require('express-mysql-session');
    var i18n = require("i18n");
    var fs = require('fs');
    var sprintf = require('sprintf-js').sprintf;
    var _ = require('lodash');
    var encryptionService = require("./lib/EncryptionDecryption.js");
    var pathPrefix = '/service';
    var compression = require('compression')
    var moment = require('moment');
    var configFile = require('./scripts/config.json');
    var db = require('./scripts/db.js');
    var commonUtils = require("./lib/CommonUtils.js");
    var logger = require("./lib/AdvancedLogger.js");
    var proxy = require('path-prefix-proxy')(pathPrefix);
    app.use(pathPrefix, proxy);
    app.use(proxy.denyUnproxied);
    var bodyParser = require('body-parser')
    console.log(encryptionService.encrypt("12345678"));
    commonUtils.setIsCookieSecure(false);

    i18n.configure({
        locales: ['en', 'de'],
        directory: __dirname + '/locales'
    });


    var appname = path.basename(process.argv[1], '.js').toLowerCase();
    var log = require('winston');
    log.configure({
        transports: [new(log.transports.File)({
            filename: 'somefile.log'
        })]
    });

    // Our routes and controllers have access to "app",
    // so give them access to the log and config objects.
    config = {}
    app.log = log;
    app.config = config;


    config.bookshelf = configFile.connConfig;
    app.set('port', process.env.PORT || configFile.port || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.engine('html', require('ejs').renderFile);

    app.use('/services', express);
    app.use(function (req, res, next) {
        if (!req.headers["access-control-request-method"] && req.url.indexOf('getPortalByDomain') < 0) {
            verifyUserAndPortal(req, res, next);
        } else {
            handleRequest(req, res, next);
        }
    });

    verifyUserAndPortal = function (req, res, next) {
        domain = req.headers["x-forwarded-host"];
        schema = app.get('schema')
        if (req.url.indexOf('/auth/authenticate') < 0 && req.url.indexOf('/auth/isValidSession') < 0) {
            authenticatUserSession(req, res, next)
        } else {
            handleRequest(req, res, next);
        }
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));


    // CORS
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Final-Length, Offset, Content-Range, Content-Disposition, server_url, account, uuid');
        res.header('Access-Control-Allow-Credentials', 'true');
        if (req.method == 'OPTIONS') {
            res.send(200);
        } else {
            next();
        }
    });

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(compression())

    app.use(i18n.init);

    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({
        cookie: {
            maxAge: 36000000,
            httpOnly: false
        },
        secret: 'MySecret'
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        app.__ = res.__;
        next();
    });


    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // Page not found errors
    app.use(function (req, res, next) {
        log.error("page not found: %s", req.url);
        res.send(app.__('Page not found'), 404);
    });

    // Server errors
    app.use(function (err, req, res, next) {
        if (err.noStackTrace)
            log.error("handled server error: status: %d: ",
                err.status || 500, err.message);
        else
            log.error("handled server error: status: %d: ",
                err.status || 500, err.stack, err);
        res.send(err.message, err.status || 500);
    });
    //app.use(fileUpload());

    // Initialize Bookshelf.
    if (process.env.SQL_TRACE == "1") config.bookshelf.debug = true;
    if (process.env.SQL_TRACE == "0") config.bookshelf.debug = false;

    // bring in Bookshelf!
    var knex = require('knex')(config.bookshelf);
    var bookshelf = require('bookshelf')(knex);
    var Bookshelf = require('bookshelf');
    Bookshelf.DB = bookshelf;
    bookshelf.plugin('pagination')
    app.set('schema', bookshelf);
    Bookshelf.DB.plugin('registry');
    Bookshelf.DB.model('_unused', {});
    Bookshelf.DB.collection('_unused', {});
    Bookshelf.DB.plugin('visibility');
    Bookshelf.DB.plugin('virtuals');

    var queryDebugMode = configFile.queryDebugMode
    handleRequest = function (req, res, next) {
        var jsonp = res.jsonp;
        res.jsonp = function (obj) {
            if (req.param('fmt') == 'xml') {
                try {
                    var o = JSON.parse(JSON.stringify(obj));
                    body = xml.render(o);
                    body = body.replace(/count\+tail/g, 'count_tail');
                    res.header('Content-Type', 'text/xml');
                    return res.send(body);
                } catch (err) {
                    return next(err);
                }
            } else {
                return jsonp.call(res, obj);
            }
        };
        res.sendError = function (statusCode, err) {
            return res.status(statusCode).send(err.message);
        }
        next();
    }

    authenticatUserSession = function (req, res, next) {
        var cookies = commonUtils.getCookies(req.headers.cookie);
        req.headers.uuid = cookies['session.tag'];
        if (req.headers.uuid == null || req.headers.uuid == '' || req.headers.uuid == undefined) {
            // commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
            res.status(401).send({
                message: "Forbidden"
            });
            return;
        }

        req.headers.uuid = encryptionService.decrypt(req.headers.uuid);
        schema.model('UserSession').forge().where({
            uuid: req.headers.uuid,
            active: 1
        }).query(function (qb) {
            qb.debug(true)
        }).fetch().then(function (data) {
            if (data) {
                var userSession = data.toJSON();
                var dumpUserSession = _.clone(userSession);
                currentTime = (new Date()).getTime();
                differenceTime = (currentTime - userSession.lastHit);
                if (differenceTime < 72000000) {
                    req.session = {
                        'uuid': userSession.uuid
                    };
                    req.headers.username = userSession.username;
                    req.headers.role = userSession.role;
                    req.headers.voterId = userSession.voterId;
                    userSession.lastHit = (new Date()).getTime();
                    var isEqual = _.isEqual(userSession, dumpUserSession);
                    if (!isEqual) {
                        data.save(userSession, {
                            method: 'update',
                            patch: true,
                            require: false
                        }).then(function (result) {
                            handleRequest(req, res, next);
                        }).catch(function (err) {
                            logger.error("Error occurred in authenticatUserSession while updating data", err)
                            if (err.message == "No Rows Updated") {
                                handleRequest(req, res, next)
                            } else {
                                // commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
                                return res.status(401).send({
                                    message: "Forbidden"
                                });
                            }
                        })
                    } else {
                        handleRequest(req, res, next);
                    }
                } else {
                    userSession.active = 0;
                    data.save(userSession, {
                        method: 'update',
                        patch: true,
                        require: false
                    }).then(function (result) {
                        commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
                        return res.status(401).send({
                            message: "Forbidden"
                        });
                    }).catch(function (err) {
                        commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
                        logger.error("Error occurred in authenticatUserSession while updating data when deactivation userSession", err)
                        return res.status(401).send({
                            message: "Forbidden"
                        });
                    })
                }
            } else {
                // commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
                return res.status(401).send({
                    message: "Forbidden"
                });
            }
        }).catch(function (err) {
            logger.error("Error occurred in authenticatUserSession while fetching data", err);
            // commonUtils.setCookie('session.tag', null, (0), true, commonUtils.getIsCookieSecure(), res);
            return res.status(401).send({
                message: "Forbidden"
            });
        })
    }
    cb();
};
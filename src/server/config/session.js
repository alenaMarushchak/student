const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function (db) {
    return session({
        name: 'userSession',
        key : 'userSession',

        secret           : '82e9e46262b351b79858455b24aa30956a016350e4a0ab5d725a9bc608d9b',
        resave           : true,
        saveUninitialized: true,

        store: new MongoStore({
            mongooseConnection: db,
            autoReconnect     : true,
            ssl               : false,
            ttl               : 10 * 365 * 24 * 60 * 60 * 1000
        }),

        cookie: {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            secure: false,

            httpOnly: false
        },

        rolling: true
    });
};
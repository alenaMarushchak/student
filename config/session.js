const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function (db) {
    return session({
        secret           : '82e9e46262b351b79858455b24b',
        resave           : false,
        saveUninitialized: true,

        store: new MongoStore({
            mongooseConnection: db,
            autoReconnect     : true,
            ssl               : false,
            ttl               : 10 * 365 * 24 * 60 * 60 * 1000
        }),

        cookie: {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true
        },

        rolling: true
    });
};
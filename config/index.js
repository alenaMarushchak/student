'use strict';

const env = process.env;

const port = +env.PORT || 3001;
const domain = env.DOMAIN || 'localhost';

module.exports = {
    port,
    domain,

    link: `http://${domain}:${port}`,

    mongo: {
        host    : env.MONGO_HOST || 'localhost',
        port    : +env.MONGO_PORT || 27017,
        name  : env.MONGO_DB_NAME || 'student',
        // user    : env.MONGO_USER_NAME || 'admin',
        // password: env.MONGO_USER_PASSWORD || 'admin'
    },

    admin:{
        password: 'admin12345',
        email: 'admin@admin.com'
    }
};

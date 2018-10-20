'use strict';

const userSchemas = require('./user');
const paramsSchemas = require('./params');
const groupSchemas = require('./group');

module.exports = {
    ...userSchemas,
    ...paramsSchemas,
    ...groupSchemas
};

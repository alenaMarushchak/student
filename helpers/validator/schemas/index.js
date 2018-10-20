'use strict';

const userSchemas = require('./user');
const paramsSchemas = require('./params');

module.exports = {
    ...userSchemas,
    ...paramsSchemas
};

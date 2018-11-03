'use strict';

const userSchemas = require('./user');
const paramsSchemas = require('./params');
const groupSchemas = require('./group');
const subjectSchemas = require('./subject');

module.exports = {
    ...userSchemas,
    ...paramsSchemas,
    ...groupSchemas,
    ...subjectSchemas
};

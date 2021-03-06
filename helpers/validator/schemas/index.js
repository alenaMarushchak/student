'use strict';

const userSchemas = require('./user');
const paramsSchemas = require('./params');
const groupSchemas = require('./group');
const subjectSchemas = require('./subject');
const blogSchemas = require('./blog');
const postSchemas = require('./post');

module.exports = {
    ...userSchemas,
    ...paramsSchemas,
    ...groupSchemas,
    ...subjectSchemas,
    ...blogSchemas,
    ...postSchemas
};

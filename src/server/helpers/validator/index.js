'use strict';

const parser = require('./parser');
const schemas = require('./schemas');
const validator = require('./validator');
const middleware = require('./middleware');

module.exports = {
    parser,
    schemas,
    validator,
    validatorMiddleware: middleware
};
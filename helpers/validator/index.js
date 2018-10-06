'use strict';

const parser = require('./parser');
const schemas = require('./schemas/index');
const validator = require('./validator');
const middleware = require('./middleware');

module.exports = {
    parser,
    schemas,
    validator,
    validatorMiddleware: middleware
};
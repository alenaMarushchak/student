'use strict';

const fs = require('fs');

const parser = require('./parser');
const schemas = require('./schemas/index');
const validator = require('./validator');

const deleteFile = function (path) {
    fs.unlink(path, err => err && console.error(err));
};

class ValidatorMiddleware {

    constructor(needParseError, removeFilesAfterError) {
        this.validate = {};
        this.needParseError = needParseError;
        this.removeFilesAfterError = removeFilesAfterError;
    }

    headers(schema) {
        this.validate.headers = schema;

        return this;
    }

    params(schema) {
        this.validate.params = schema;

        return this;
    }

    query(schema) {
        this.validate.query = schema;

        return this;
    }

    body(schema) {
        this.validate.body = schema;

        return this;
    }

    file(schema) {
        this.validate.files = schema;

        return this;
    }

    files(schema) {
        this.validate.files = schema;

        return this;
    }

    set(obj, schema) {
        if (schema) {
            this.validate[obj] = schema;
        } else {
            this.validate = {...obj};
        }

        return this;
    }

    middleware() {
        return (req, res, next) => {
            for(const [property, schema] of Object.entries(this.validate)){
                const value = req[property];

                if (!req.hasOwnProperty(property)) {
                    throw new Error('property not found');
                }

                if (typeof schema === 'string' && !schemas[schema]) {
                    throw new Error('schema not found');
                }

                const validatorError = validator(value, typeof schema === 'string' ? schemas[schema] : schema);

                if (validatorError) {
                    const errorMessage = this.needParseError ? parser(validatorError) : validatorError;
                    const error = new Error(errorMessage);

                    error.status = 400;

                    if (this.removeFilesAfterError && property === 'file') {
                        deleteFile(value.path);
                    }

                    if (this.removeFilesAfterError && property === 'files') {
                        Object.values(value).forEach(item => {
                            if (item instanceof Array) {
                                return item.forEach(file => deleteFile(file.path));
                            }

                            deleteFile(item.path);
                        });
                    }

                    throw error;
                }
            }

            next();
        };
    }

}

module.exports = (needParseError = true, removeFilesAfterError = true) => {
    return new ValidatorMiddleware(needParseError, removeFilesAfterError);
};

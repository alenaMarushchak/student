'use strict';

const moment = require('moment');
const validate = require("validate.js");

validate.extend(validate.validators.datetime, {
    parse : function (value, options) {
        return +moment.utc(value);
    },
    format: function (value, options) {
        const format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return moment.utc(value).format(format);
    }
});


validate.validators.isArray = function (value, opts, key, target) {
    let {message = `Incorrect ${key} - value`, isRequired = false} = opts;

    if (isRequired && !validate.isArray(value)) {
        return message
    }
};


validate.validators.timestampBetween = function (value, opts, key, target) {
    let {start = 0, end = Date.now(), message = `Incorrect ${key} - value`} = opts;

    value = parseInt(value, 10);

    if (!value) {
        return message;
    }

    if (typeof start === 'function') {
        start = start();
    }

    if (typeof end === 'function') {
        end = end();
    }

    if (value < start || value > end) {
        return message;
    }
};

module.exports = (obj, schema) => {
    return validate(obj, schema);
};

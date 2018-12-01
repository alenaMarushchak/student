'use strict';

module.exports = {
    name: {
        format: {
            pattern: "[A-z]+[0-9]+",
            flags: "i",
            message: "can only contain a-z "
        },
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        }
    },

};
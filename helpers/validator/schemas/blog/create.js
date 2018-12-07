'use strict';

module.exports = {
    name: {
        format: {
            pattern: "^[a-zA-Z0-9_.-]*$",
            flags: "i",
            message: "can only contain a-z "
        },
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        }
    },

    tags: {
        isArray: true
    }

};
'use strict';

module.exports = {
    title: {
        format  : {
            pattern: "^[a-zA-Z0-9_.-]*$",
            flags  : "i",
            message: "can only contain a-z "
        },
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        },
        length  : {
            minimum: 3,
            maximum: 60
        }
    },

    description: {
        format  : {
            pattern: "^[a-zA-Z0-9_.-]*$",
            flags  : "i",
            message: "can only contain a-z "
        },
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        },
        length  : {
            minimum: 3,
            maximum: 256
        }
    }

};
'use strict';

module.exports = {
    email   : {
        email   : {
            message: "'%{value}' is not valid"
        },
        presence: {
            allowEmpty: false,
            message   : "is required"
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message   : "is required"
        },
        length  : {
            minimum: 8,
            maximum: 16
        }
    }
};
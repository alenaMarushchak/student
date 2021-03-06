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
    lastName       : {
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        }
    },
    firstName      : {
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        }
    },
    role: {
        numericality: {
            onlyInteger: true,
        },
    }

};
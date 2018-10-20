'use strict';

module.exports = {
    email    : {
        email   : {
            message: "'%{value}' is not valid"
        },
        presence: {
            allowEmpty: true,
        }
    },
    lastName : {
        presence: {
            allowEmpty: true
        }
    },
    firstName: {
        presence: {
            allowEmpty: true
        }
    },
    role     : {
        numericality: {
            onlyInteger: true,
        },
        format      : {
            pattern: /[5,10]/,
            flags  : "i",
            message: "can only be 5 or 10"
        },
        presence    : {
            allowEmpty: true
        }
    }

};
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
        presence    : {
            allowEmpty: true
        }
    }

};
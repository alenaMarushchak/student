'use strict';

module.exports = {
    oldPassword    : {
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        },
        length  : {
            minimum: 8,
            maximum: 16
        }
    },
    newPassword    : {
        presence: {
            message   : '%{value} is required',
            allowEmpty: false
        },
        length  : {
            minimum: 8,
            maximum: 16
        }
    },
    confirmNewPassword: {
        equality: {
            attribute: 'newPassword',
            message  : '%{value} not equal to new password'
        }
    }
};

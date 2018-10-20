'use strict';

const USER_SIGN_IN = require('./signIn');
const USER_CHANGE_PASSWORD = require('./changePassword');
const USER_CREATE = require('./createUser');
const UPDATE_USER = require('./updateUser');

module.exports = {
    USER_SIGN_IN,
    USER_CHANGE_PASSWORD,
    USER_CREATE,
    UPDATE_USER
};

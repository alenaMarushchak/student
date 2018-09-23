'use strict';

const mongoose = require('mongoose');

const UserModel = require('../models/user');

const SuperService = require('./super');

const CONSTANTS = require('../const');

const ObjectId = mongoose.Types.ObjectId;

class UserService extends SuperService {

}

module.exports = new UserService(UserModel);
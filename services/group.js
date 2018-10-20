'use strict';

const mongoose = require('mongoose');

const GroupModel = require('../models/group');

const SuperService = require('./super');

const CONSTANTS = require('../constants');

const ObjectId = mongoose.Types.ObjectId;

class GroupService extends SuperService {

}

module.exports = new GroupService(GroupModel);
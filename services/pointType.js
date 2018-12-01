'use strict';

const PointTypeModel = require('../models/pointTypes');

const SuperService = require('./super');

class PointTypeService extends SuperService {

}

module.exports = new PointTypeService(PointTypeModel);
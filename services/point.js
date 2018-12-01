'use strict';

const PointModel = require('../models/point');

const SuperService = require('./super');

class PointService extends SuperService {

}

module.exports = new PointService(PointModel);
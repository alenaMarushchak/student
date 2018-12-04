'use strict';

const PointTypeModel = require('../models/pointTypes');

const SuperService = require('./super');

class PointTypeService extends SuperService {
   findByType(type){
       return this.findOne({
           name: type
       })
   }
}

module.exports = new PointTypeService(PointTypeModel);
'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CONSTANTS = require('../constants');

const schema = new Schema(
    {
        name: {
            type: String,
            enum: [CONSTANTS.POINT_TYPES.MODULE1, CONSTANTS.POINT_TYPES.MODULE2, CONSTANTS.POINT_TYPES.EXAM]
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.POINT_TYPES
    });

module.exports = mongoose.model(CONSTANTS.MODEL.POINT_TYPE, schema);

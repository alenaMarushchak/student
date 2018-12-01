'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const CONSTANTS = require('../constants');

const schema = new Schema(
    {
        type: {
            type: ObjectId,
            ref : CONSTANTS.COLLECTION.POINT_TYPES
        },

        value: {
            type: Number,
            max : 100,
            min : 0
        },

        student: {
            type: ObjectId,
            ref : CONSTANTS.COLLECTION.USERS
        },

        teacher: {
            type: ObjectId,
            ref : CONSTANTS.COLLECTION.USERS
        },

        subject: {
            type: ObjectId,
            ref : CONSTANTS.COLLECTION.SUBJECTS
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.POINTS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.POINT, schema);

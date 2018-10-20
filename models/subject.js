'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const CONSTANTS = require('../constants');

const schema = new Schema(
    {
        name: {
            type    : String,
            required: true
        },

        teacher: {
            type: ObjectId
        },

        pointTypes: {
            type   : Array,
            default: []
        },

    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.SUBJECTS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.SUBJECT, schema);

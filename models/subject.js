'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

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

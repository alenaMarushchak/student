'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CONSTANTS = require('../constants');

const schema = new Schema(
    {
        name: {
            type    : String,
            required: true
        },

        students: {
            type   : Array,
            default: []
        },

        subjects: {
            type   : Array,
            default: []
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.GROUPS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.GROUP, schema);

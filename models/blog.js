'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CONSTANTS = require('../constants');

const schema = new Schema(
    {
        author: {
            type: ObjectId,
            ref : CONSTANTS.COLLECTION.USERS,
            required: true
        },

        name: {
            type    : String,
            required: true
        },

        tags: []
    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.BLOG
    });

module.exports = mongoose.model(CONSTANTS.MODEL.BLOG, schema);

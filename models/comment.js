'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CONSTANTS = require('../constants');

const schema = new Schema(
    {
        author: {
            type: ObjectId,
            ref : CONSTANTS.COLLECTION.USERS
        },

        post: {
            type    : ObjectId,
            ref     : CONSTANTS.COLLECTION.POSTS,
            required: true
        },

        text: {
            type    : String,
            required: true
        },

        likes: [],

    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.COMMENTS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.COMMENT, schema);



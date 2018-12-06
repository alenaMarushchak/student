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

        blog: {
            type    : ObjectId,
            ref     : CONSTANTS.COLLECTION.BLOG,
            required: true
        },

        title: {
            type    : String,
            required: true
        },

        description: {
            type: String
        },

        likes: [],

        attachments: {
            photo: [],
            video: []
        } //will added soon
    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.POSTS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.POST, schema);



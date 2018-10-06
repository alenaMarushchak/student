'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const CONSTANTS = require('../constants/index');

const schema = new Schema(
    {

        firstName: {
            type    : String,
            required: true
        },

        lastName: {
            type    : String,
            required: true
        },

        email: {
            type    : String,
            required: true,
            unique  : true
        },

        avatar: {
            type: String,
            //default : 'public/default_avatar.jpg'
        },

        role: {
            type    : Number,
            required: true
        },

        password: {
            type    : String,
        },

        notifications: [],
    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.USERS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.USER, schema);

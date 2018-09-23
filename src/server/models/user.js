'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const CONSTANTS = require('../constants');

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
            type    : String,
           // required: true,
            //default : 'public/default_avatar.jpg'
        },

        type: {
            type    : String,
            required: true,
            //enum    : CONSTANTS.USER_TYPES,
            //default : CONSTANTS.USER_TYPE.USER
        },

        password: {
            type    : String,
            required: false,
            select  : false
        }

    },
    {
        timestamps: true,
        versionKey: false,
        collection: CONSTANTS.COLLECTION.USERS
    });

module.exports = mongoose.model(CONSTANTS.MODEL.USER, schema);

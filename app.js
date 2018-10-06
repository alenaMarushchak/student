'use strict';

const path = require('path');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('./config/session');

const router = require('./routers/index');
const cors = require('./helpers/cors').default;

module.exports = (app, db) => {
    app.use(cors);

    app.use(session(db));

    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '500mb'}));
    app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

    app.use(router);
};

'use strict';

const http = require('http');
const express = require('express');
const winston = require('winston');

const database = require('./db');
const config = require('./config');

const app = express();
const port = config.port;
const domain = config.domain || 'localhost';
const server = http.createServer(app);

const createAdmin = require('./helpers/createDefaultAdmin');
const createPointTypes = require('./helpers/createPointTypes');
const createFakeData = require('./helpers/createFakeData');

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            winston.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            winston.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    console.log(domain, port);

    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    winston.info('Listening on ' + bind);

    console.log('\nhttp://' + domain + ':' + port + '/');
}

async function init(db) {
    require('express-async-errors');

    require('./app')(app, db);

    createAdmin();
    createPointTypes();
   // createFakeData();

    server.listen(port, domain);
}

server.on('error', onError);
server.on('listening', onListening);

database.connect(config).then(init).catch(console.error);
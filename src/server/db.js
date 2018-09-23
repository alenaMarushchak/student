const mongoose = require('mongoose');

function getMongoUrl(config) {

    let connectionString = 'mongodb://';

    if (config.mongo.user && config.mongo.password) {
        connectionString += `${config.mongo.user}:${config.mongo.password}@`;
    }

    return connectionString.concat(`${config.mongo.host}:${config.mongo.port}/${config.mongo.name}`);

}

mongoose.Promise = global.Promise;

module.exports.connect = function (config) {
    const connectionString = getMongoUrl(config);
    const opts = {
        autoReconnect    : true,
        keepAlive        : true,
        reconnectTries   : 100,
        reconnectInterval: 30000
    };

    return new Promise((resolve, reject) => {

        mongoose.connect(connectionString, opts, err => {
            if (err) {
                console.error('MongoDB connection error: ', err);
                return reject(err);
            }

            const db = mongoose.connection;

            module.exports.db = db;

            db.on('disconnect', error => {
                console.error(error);
                throw error;
            });

            db.on('reconnectFailed', error => {
                console.error(error);
                throw error;
            });

            db.on('error', function (error) {
                console.error('MongoDB throw an exception: ', error);
                throw error;
            });

            console.info('Connected to db');

            resolve(db);
        });
    });
};

module.exports.disconnect = function () {

    return new Promise((resolve, reject) => {
        mongoose.disconnect(err => {
            if (err) {
                console.error('MongoDB disconnect error: ' + err);
                return reject(err);
            }

            resolve();
        });
    });

};

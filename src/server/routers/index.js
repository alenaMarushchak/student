'use strict';

const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
    const err = new Error('Not Found');

    console.log(req.originalUrl);

    err.status = 404;

    next(err);
});

router.use((err, req, res, next) => {
    err.status = err.status || 500;

    console.error(err);

    res.status(err.status).send({message: err.message});
});

module.exports = router;

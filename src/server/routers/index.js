'use strict';

const express = require('express');

const {isAuthorize, isAdmin, isTeacher, isStudent} = require('../helpers/sessionService');

const admin = require('./admin');
// const teacher = require('./teacher');
// const student = require('./student');
const profile = require('./profile');

const router = express.Router();

router.use(profile);

router.use(isAuthorize);

router.use('/admin', isAdmin, admin);

// router.use('/teacher', isTeacher, teacher);
//
// router.use('/student', isStudent, student);

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

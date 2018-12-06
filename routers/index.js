'use strict';

const express = require('express');

const {isAuthorize, isAdmin, isTeacher, isStudent} = require('../helpers/sessionService');

const admin = require('./admin/index');
const teacher = require('./teacher');
const student = require('./student');
const auth = require('./auth');
const profile = require('./profile');
const select = require('./select');
const blog = require('./blog');

const router = express.Router();

router.use(auth);

router.use(isAuthorize);

router.use('/profile', profile);
router.use('/select', select);
router.use('/blog', blog);

router.use('/admin', isAdmin, admin);

router.use('/teacher', isTeacher, teacher);

router.use('/student', isStudent, student);

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

const express = require('express');

const userRouter = require('./user');
const groupRouter = require('./group');
const subjectRouter = require('./subject');

const router = express.Router();

router.use('/user', userRouter);
router.use('/group', groupRouter);
router.use('/subject', subjectRouter);

module.exports = router;

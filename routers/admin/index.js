const express = require('express');

const userRouter = require('./user');
const groupRouter = require('./group');
const subjectRouter = require('./subject');
const statisticRouter = require('./statistic');

const router = express.Router();

router.use('/statistic', statisticRouter);
router.use('/user', userRouter);
router.use('/group', groupRouter);
router.use('/subject', subjectRouter);

module.exports = router;

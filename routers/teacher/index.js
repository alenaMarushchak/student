const express = require('express');

const groupRouter = require('./group');
const subjectRouter = require('./subject');
const pointRouter = require('./point');
const studentRouter = require('./students');
const statisticRouter = require('./statistic');

const router = express.Router();

router.use('/statistic', statisticRouter);
router.use('/point', pointRouter);
router.use('/group', groupRouter);
router.use('/subject', subjectRouter);
router.use('/student', studentRouter);

module.exports = router;
const express = require('express');

const groupRouter = require('./group');
const pointRouter = require('./point');
const statisticRouter = require('./statistic');

const router = express.Router();

router.use('/statistic', statisticRouter);
router.use('/point', pointRouter);
router.use('/group', groupRouter);

module.exports = router;
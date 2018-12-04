const express = require('express');

const groupRouter = require('./group');
const pointRouter = require('./point');

const router = express.Router();

router.use('/point', pointRouter);
router.use('/group', groupRouter);

module.exports = router;
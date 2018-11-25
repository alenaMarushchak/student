const express = require('express');

const groupRouter = require('./group');
const subjectRouter = require('./subject');

const router = express.Router();

router.use('/group', groupRouter);
router.use('/subject', subjectRouter);

module.exports = router;
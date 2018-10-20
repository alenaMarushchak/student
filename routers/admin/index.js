const express = require('express');

const userRouter = require('./user');
const groupRouter = require('./group');

const router = express.Router();

router.use('/user', userRouter);
router.use('/group', groupRouter);

module.exports = router;

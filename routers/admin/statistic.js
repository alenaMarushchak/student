const express = require('express');

const statisticController = require('../../controllers/statistic');

const router = express.Router();

router.get('/', statisticController.getAdminStatistic);

router.get('/student', statisticController.getStudentStatistic);


module.exports = router;

const express = require('express');

const userController = require('../../controllers/user');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/', userController.getStudentsList);

router.get('/:id',
    validatorMiddleware().params('ID').middleware(),
    userController.getPointsOfStudentForAllTime);

module.exports = router;
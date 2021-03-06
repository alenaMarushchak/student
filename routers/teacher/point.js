const express = require('express');

const pointController = require('../../controllers/point');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.put('/:type', validatorMiddleware().params('POINT_TYPE').middleware(), pointController.addEditPoint);

module.exports = router;
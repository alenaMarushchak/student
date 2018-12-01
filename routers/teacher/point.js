const express = require('express');

const pointController = require('../../controllers/point');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/:id', validatorMiddleware().params('ID').middleware(), pointController.addEditPoint);

module.exports = router;
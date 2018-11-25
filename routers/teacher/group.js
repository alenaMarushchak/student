const express = require('express');

const groupController = require('../../controllers/group');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/subject/:id', validatorMiddleware().params('ID').middleware(), groupController.getGroupsBySubject);

router.put('/:id/students', validatorMiddleware().params('ID').middleware(), groupController.addRemoveStudentsFromGroup);

module.exports = router;
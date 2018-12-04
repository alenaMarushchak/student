const express = require('express');

const groupController = require('../../controllers/group');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/', groupController.getGroupsList);

router.get('/subject/:id', validatorMiddleware().params('ID').middleware(), groupController.getGroupsBySubject);

router.get('/:id',validatorMiddleware().params('ID').middleware(), groupController.getGroupById);

router.get('/:id/subject/:subjectId',
    validatorMiddleware().params('GROUP_IDS').middleware(),
    groupController.getStudentsOfGroupWithPoints);

module.exports = router;
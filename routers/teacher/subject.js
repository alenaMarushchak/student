const express = require('express');

const subjectController = require('../../controllers/subject');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/own', subjectController.getTeahersSubject);

router.get('/', subjectController.getSubjectsList);

router.put('/:id/add', validatorMiddleware().params('ID').middleware(), subjectController.addTeacherToSubject);

router.put('/:id/remove', validatorMiddleware().params('ID').middleware(), subjectController.removeTeacherFromSubject);

module.exports = router;

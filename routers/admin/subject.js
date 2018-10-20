const express = require('express');

const subjectController = require('../../controllers/subject');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/', subjectController.getSubjectsList);

router.get('/:id', validatorMiddleware().params('ID').middleware(), subjectController.getSubjectById);

router.post('/', validatorMiddleware().body('SUBJECT_CREATE').middleware(), subjectController.createSubject);

router.patch('/:id',
    validatorMiddleware().params('ID').middleware(),
    validatorMiddleware().body('UPDATE_SUBJECT').middleware(),
    subjectController.updateSubject);

router.delete('/:id', validatorMiddleware().params('ID').middleware(), subjectController.deleteSubject);

module.exports = router;

const express = require('express');

const groupController = require('../../controllers/group');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/', groupController.getGroupsList);

router.get('/:id', validatorMiddleware().params('ID').middleware(), groupController.getGroupById);

router.post('/', validatorMiddleware().body('GROUP_CREATE').middleware(), groupController.createGroup);

router.patch('/:id',
    validatorMiddleware().params('ID').middleware(),
    validatorMiddleware().body('UPDATE_GROUP').middleware(),
    groupController.updateGroup);

router.delete('/:id', validatorMiddleware().params('ID').middleware(), groupController.deleteGroup);

module.exports = router;

const express = require('express');

const userController = require('../../controllers/user');
const {validatorMiddleware} = require('../../helpers/validator/index');

const router = express.Router();

router.get('/', userController.getUsersList);

router.get('/:id', validatorMiddleware().params('ID').middleware(), userController.getUserById);

router.post('/', validatorMiddleware().body('USER_CREATE').middleware(), userController.createUser);

router.patch('/:id',
    validatorMiddleware().params('ID').middleware(),
    validatorMiddleware().body('UPDATE_USER').middleware(),
    userController.updateUser);

router.delete('/:id', validatorMiddleware().params('ID').middleware(), userController.deleteUser);

module.exports = router;

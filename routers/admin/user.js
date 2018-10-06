const express = require('express');

const userController = require('../../controllers/user');
const {validatorMiddleware} = require('../../helpers/validator/index');

const router = express.Router();

router.get('/', userController.getUsersList);

router.post('/', validatorMiddleware().body('USER_CREATE').middleware(), userController.createUser);

//router.patch('/:id', userController.updateUser);

//router.delete('/:id', userController.deleteUser);

module.exports = router;

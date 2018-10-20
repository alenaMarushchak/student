const express = require('express');

const userController = require('../controllers/user');

const {isAuthorize} = require('../helpers/sessionService');
const {validatorMiddleware} = require('../helpers/validator/index');

const router = express.Router();

router.post('/signIn', validatorMiddleware().body('USER_SIGN_IN').middleware(),  userController.signIn);

//router.post('/forgotPassword', userController.updateUser);

router.get('/', isAuthorize, userController.getUserProfile);

router.delete('/signOut', userController.signOut);

module.exports = router;

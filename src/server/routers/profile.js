const express = require('express');

const userController = require('../controllers/user');

const {isAuthorize} = require('../helpers/sessionService');

const router = express.Router();

router.post('/signIn', userController.signIn);

//router.post('/forgotPassword', userController.updateUser);

router.get('/', isAuthorize, userController.getUserProfile);

router.delete('/signOut', isAuthorize, userController.signOut);

module.exports = router;

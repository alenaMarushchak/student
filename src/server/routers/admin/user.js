const express = require('express');

const userController = require('../../controllers/user');

const router = express.Router();

router.get('/', userController.getUsersList);

router.post('/', userController.createUser);

router.patch('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;

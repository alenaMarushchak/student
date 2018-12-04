const express = require('express');

const groupController = require('../../controllers/group');
const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/', groupController.getMyGroup);
const express = require('express');

const subjectController = require('../../controllers/subject');
const userController = require('../../controllers/user');

const router = express.Router();

router.get('/subject', subjectController.getSubjectsList);

router.get('/students', userController.getStudentsForSelect);

module.exports = router;

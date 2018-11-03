const express = require('express');
const uuid = require('uuid');

const userController = require('../controllers/user');

const CONSTANTS = require('../constants');

const {isAuthorize} = require('../helpers/sessionService');
const filesLocalStorage = require('../helpers/filesLocalStorage');

const uploadAvatar = filesLocalStorage()
    .diskStorage('files/avatars', uuid.v4)
    .fileFilter({
        avatar: CONSTANTS.FILES.MIMETYPES.IMG
    }, true)
    .limits({
        files   : 1,
        fileSize: CONSTANTS.FILES.LIMITS.TEN_MB
    })
    .middleware()
    .single('avatar');

const router = express.Router();

router.put('/', isAuthorize, uploadAvatar,  userController.updateUsersAvatar);

module.exports = router;

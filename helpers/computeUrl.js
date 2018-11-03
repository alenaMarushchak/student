'use strict';

module.exports = function (fileName, folderName) {
    return process.env.WEB_HOST + "\/" + folderName + "\/" + fileName;
};
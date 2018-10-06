const CustomError = require('./CustomError');
const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');

const CONSTANTS = require('../constants/index');

module.exports.isAuthorize = function (req, res, next) {
    if (req.session && req.session.userId && req.session.role) {
        return next();
    }

    if (req.session && req.session.userId) {
        req.session.destroy(function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

    return next(new CustomError(401, ERROR_MESSAGES.UNAUTHORIZED));
};

module.exports.register = function (req, res, user) {
    req.session.loggedIn = true;
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.save(function (err) {
        if (err) {
            console.error(err);
        }
    });

    res.status(200).send(user);
};

module.exports.destroy = function (req, res) {
    if (req.session && req.session.userId && req.session.role) {
        req.session.destroy(function (err) {
            if (err) {
                console.error(err);
            }
        });
    }

    res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('log out')});
};

module.exports.isAdmin = function (req, res, next) {
    if (req.session && req.session.userId && req.session.role === CONSTANTS.ROLES.ADMIN) {
        return next();
    }

    next(new CustomError(403, ERROR_MESSAGES.FORBIDDEN));
};

module.exports.isTeacher = function (req, res, next) {
    if (req.session && req.session.userId && req.session.role === CONSTANTS.ROLES.TEACHER) {
        return next();
    }

    next(new CustomError(403, ERROR_MESSAGES.FORBIDDEN));
};

module.exports.isStudent = function (req, res, next) {
    if (req.session && req.session.userId && req.session.role === CONSTANTS.ROLES.STUDENT) {
        return next();
    }

    next(new CustomError(403, ERROR_MESSAGES.FORBIDDEN));
};

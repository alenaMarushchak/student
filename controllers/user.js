const _ = require('lodash');

const userService = require('../services/user');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const CustomError = require('../helpers/CustomError');
const security = require('../helpers/security');
const {pagination, pages} = require('../helpers/parser');
const generatePassword = require('../helpers/generateRandomPassword');
const {register, destroy} = require('../helpers/sessionService');
const mailer = require('../helpers/mailer');

class UserController {
    async signIn(req, res) {
        const body = req.body;

        let {email, password} = body;

        password = await security.hash(password);

        const userModel = await userService.findOne({email, password});

        if (!userModel) {
            throw new CustomError(400, ERROR_MESSAGES.INCORRECT('email or password'));
        }

        res.status(200).send(register(req, res, userService.getUserProjection(userModel)));
    }

    async signOut(req, res) {
        return destroy(req, res);
    }

    async getUserProfile(req, res) {
        const {session: userId} = req;

        const userProfile = await userService.getUserProfile(userId);

        res.status(200).send(userProfile);
    }

    async createUser(req, res) {
        const body = req.body;

        const {email, role, firstName, lastName} = body;

        const userWithSameEmail = await userService.findOne({email});

        if (userWithSameEmail) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('Email'));
        }

        let password = generatePassword(10);

        let hashPassword = await security.hash(password);

        const userModel = await userService.save({
            email,
            role,
            firstName,
            lastName,
            password: hashPassword,
        });

        res.status(201).send(userService.getUserProjection(userModel, true));

        try {
            mailer.sendInvite(email, {password});
        } catch (err) {
            console.log(err);
        }
    }

    async updateUser(req, res) {
        const {body, params: {id: userId}} = req;

        const userForUpdate = await userService.findById(userId);

        if (!userForUpdate) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('user'));
        }

        let updateObj = {};
        let {firstName, lastName, email, role} = body;

        if (firstName && userForUpdate.get('firstName') !== firstName) {
            updateObj.firstName = firstName;
        }

        if (lastName && userForUpdate.get('lastName') !== lastName) {
            updateObj.lastName = lastName;
        }

        if (email && userForUpdate.get('email') !== email) {
            updateObj.email = email;
        }

        if (role && userForUpdate.get('role') !== role && role !== CONSTANTS.ROLES.ADMIN) {
            updateObj.role = role;
        }

        if (!Object.keys(updateObj).length) {
            throw new CustomError(400, ERROR_MESSAGES.NOTHING_TO_UPDATE);
        }

        await userService.update(
            {
                _id: userId
            },
            {
                $set: updateObj
            }
        );

        const userProfile = await userService.getUserProfile(userId, true);

        res.status(200).send(userProfile);
    }

    async deleteUser(req, res) {
        const {params: {id: userId}} = req;

        await userService.remove(
            {
                _id : userId,
                role: {
                    $gt: CONSTANTS.ROLES.ADMIN
                }
            }
        );

        //TODO remove all posts, and comments, remove from groups, and from subjects, remove all points

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove user')});
    }

    async getUsersList(req, res) {
        const query = req.query;

        const {page, limit} = pagination(query);

        const [total, data = []] = await userService.fetchUsers(page, limit);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }
}

module.exports = new UserController();
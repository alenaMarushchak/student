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
const fileHelper = require('../helpers/files');
const computeUrl = require('../helpers/computeUrl');

class UserController {
    async signIn(req, res) {
        const body = req.body;

        let {email, password} = body;

        let userModel = await userService.findOne({email});

        if (!userModel) {
            throw new CustomError(400, ERROR_MESSAGES.INCORRECT('email or password'));
        }

        const userPassword = userModel.get('password');

        const correctPassword = await security.compare(password, userPassword);

        if (!correctPassword) {
            throw new CustomError(400, ERROR_MESSAGES.INCORRECT('email or password'));
        }

        res.status(200).send(register(req, res, userService.getUserProjection(userModel)));
    }

    async signOut(req, res) {
        return destroy(req, res);
    }

    async getUserProfile(req, res) {
        const {userId} = req.session;

        const userModel = await userService.getUserProfile(userId);

        res.status(200).send(userService.getUserProjection(userModel));
    }

    async createUser(req, res) {
        const body = req.body;

        let {email, role, firstName, lastName} = body;

        const userWithSameEmail = await userService.findOne({email});

        if (userWithSameEmail) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('Email'));
        }

        role = +role;

        if (role !== 5 && role !== 10) {
            throw new CustomError(400, ERROR_MESSAGES.INCORRECT('role'))
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

        // try {
        //     mailer.sendInvite(email, {password});
        // } catch (err) {
        //     console.log(err);
        // }
    }

    async updateUser(req, res) {
        const {body, params: {id: userId}} = req;

        const userForUpdate = await userService.findById(userId);

        if (!userForUpdate) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('user'));
        }

        let updateObj = {};
        let {firstName, lastName, email, role} = body;

        if (role) {
            role = +role;

            if (role !== 5 && role !== 10) {
                throw new CustomError(400, ERROR_MESSAGES.INCORRECT('role'))
            }
        }

        if (firstName && userForUpdate.get('firstName') !== firstName) {
            updateObj.firstName = _.escape(firstName);
        }

        if (lastName && userForUpdate.get('lastName') !== lastName) {
            updateObj.lastName = _.escape(lastName);
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

        await userService.updateOne(
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

        await userService.deleteOne(
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
        let error;

        let {search, sort} = query;

        try {
            sort = JSON.parse(sort);
        } catch (err) {
            error = err;
        }

        if (error) {
            sort = {};
        }

        let {sortKey = 'role', sortOrder = 1} = sort;

        let sortObj = {};
        sortOrder = (+sortOrder) === 1 ? 1 : -1;
        sortKey = CONSTANTS.USERS.SORT_FIELDS.indexOf(sortKey) === -1 ? 'name' : sortKey;

        if (sortKey === 'name') {
            sortObj = {
                firstName: sortOrder,
                lastName : sortOrder
            };
        } else {
            sortObj[sortKey] = sortOrder;
        }

        search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&");

        const {page, limit} = pagination(query);

        const [total, data = []] = await userService.fetchUsers(page, limit, search, sortObj);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async getUserById(req, res) {
        const {params: {id: userId}} = req;

        const userProfile = await userService.getUserProfile(userId, true);

        if (!userProfile) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('user'));
        }

        res.status(200).send(userProfile);
    }

    async updateUsersAvatar(req, res) {
        const {
            session: {
                userId
            },
            file   : avatar
        } = req;

        if (!avatar) {
            throw new CustomError(400, ERROR_MESSAGES.NOTHING_TO_UPDATE);
        }

        let userModel = await userService.findById(userId);

        if (!userModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('user'));
        }

        let {avatar: oldAvatar} = userModel.toJSON();

        if (oldAvatar) {
            const oldAvatarUrl = computeUrl(oldAvatar, CONSTANTS.FILES.BUCKETS.AVATAR);

            fileHelper.deleteFile(oldAvatarUrl).catch(console.error);
        }

        await userService.updateOne(
            {_id: userId},
            {
                $set: {
                    avatar: avatar.filename
                }
            });

        const user = await userService.getUserProfile(userId);

        res.status(200).send(userService.getUserProjection(user));
    }
}

module.exports = new UserController();
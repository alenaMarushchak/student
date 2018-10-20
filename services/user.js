'use strict';

const mongoose = require('mongoose');

const UserModel = require('../models/user');

const SuperService = require('./super');

const CONSTANTS = require('../constants/index');

const ObjectId = mongoose.Types.ObjectId;

class UserService extends SuperService {
    getUserProfile(userId, forAdmin) {
        const aggregateParams = [];

        const project = {
            firstName: 1,
            lastName : 1,
            email    : 1,
            avatar   : 1,
            role     : 1,
        };

        if (!forAdmin) {
            project.notifications = 1;
        }

        aggregateParams.push(
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                $project: project
            }
        );

        return this.aggregateOne(aggregateParams);
    }

    getUserProjection(userModel, forAdmin) {
        const result = userModel.toJSON ? userModel.toJSON() : userModel;

        if (forAdmin) {
            return {
                _id      : result._id,
                email    : result.email,
                role     : result.role,
                firstName: result.firstName,
                lastName : result.lastName,
                avatar   : result.avatar,
            };
        }

        return {
            _id          : result._id,
            email        : result.email,
            role         : result.role,
            firstName    : result.firstName,
            lastName     : result.lastName,
            avatar       : result.avatar,
            notifications: result.notifications
        }
    }

    fetchUsers(page, limit, search) {
        const aggregateParams = [];
        const skip = (page - 1) * limit;
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');
        const match = {
            $or: [
                {role: CONSTANTS.ROLES.STUDENT},
                {role: CONSTANTS.ROLES.TEACHER}
            ]
        };

        if (search) {
            match.$or.push(
                {
                    firstName: {$regex: searchRegExp}
                },
                {
                    lastName: {$regex: searchRegExp}
                },
                {
                    email: {$regex: searchRegExp}
                },
            )
        }

        aggregateParams.push(
            {
                $match: match
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id      : 1,
                    email    : 1,
                    avatar   : 1,
                    lastName : 1,
                    firstName: 1,
                    createdAt: 1,
                    role     : 1
                }
            }
        );

        return Promise.all([
            this.count(match),
            this.aggregate(aggregateParams)
        ]);
    }
}

module.exports = new UserService(UserModel);
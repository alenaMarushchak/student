'use strict';

const mongoose = require('mongoose');

const UserModel = require('../models/user');

const SuperService = require('./super');

const CONSTANTS = require('../constants/index');
const computeUrl = require('../helpers/computeUrl');

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
        let avatarUrl = '';

        if (result.avatar) {
            avatarUrl = computeUrl(result.avatar, CONSTANTS.FILES.BUCKETS.AVATAR);
        }

        if (forAdmin) {
            return {
                _id      : result._id,
                email    : result.email,
                role     : result.role,
                firstName: result.firstName,
                lastName : result.lastName,
                avatar   : avatarUrl,
            };
        }

        return {
            _id          : result._id,
            email        : result.email,
            role         : result.role,
            firstName    : result.firstName,
            lastName     : result.lastName,
            avatar       : avatarUrl,
            notifications: result.notifications
        }
    }

    fetchUsers(page, limit, search, sortObj) {
        const aggregateParams = [];
        const skip = (page - 1) * limit;
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');
        let match = {};
        const $or = [
            {role: CONSTANTS.ROLES.STUDENT},
            {role: CONSTANTS.ROLES.TEACHER}
        ];

        if (search) {
            match = {
                $and: [
                    {$or},
                    {
                        $or: [
                            {
                                $and: [
                                    {
                                        firstName: {$regex: searchRegExp}
                                    },
                                    {
                                        lastName: {$regex: searchRegExp}
                                    },
                                ]
                            },
                            {
                                email: {$regex: searchRegExp}
                            }
                        ]
                    }
                ]
            }
        } else {
            match = {
                $or
            }
        }

        aggregateParams.push(
            {
                $match: match
            });

        if (Object.keys(sortObj).length) {
            aggregateParams.push(
                {
                    $sort: sortObj
                }
            );
        } else {
            aggregateParams.push(
                {
                    $sort: {
                        createdAt: 1
                    }
                }
            );
        }

        aggregateParams.push({
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

    fetchStudentsForSelect(page, limit, search) {
        const aggregateParams = [];
        const skip = (page - 1) * limit;
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');
        let match = {};

        if (search) {
            match = {
                $and: [
                    {role: CONSTANTS.ROLES.STUDENT},
                    {
                        $or: [
                            {
                                firstName: {$regex: searchRegExp}
                            },
                            {
                                lastName: {$regex: searchRegExp}
                            },
                            {
                                email: {$regex: searchRegExp}
                            }
                        ]
                    }
                ]
            }
        } else {
            match = {role: CONSTANTS.ROLES.STUDENT};
        }

        aggregateParams.push(
            {
                $match: match
            },
            {
                $sort: {
                    createdAt: 1
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
                    _id : 1,
                    name: {$concat: ["$firstName", " ", "$lastName"]}
                }
            });

        return Promise.all([
            this.count(match),
            this.aggregate(aggregateParams)
        ]);
    }
}

module.exports = new UserService(UserModel);
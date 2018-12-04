'use strict';

const mongoose = require('mongoose');

const GroupModel = require('../models/group');

const SuperService = require('./super');

const CONSTANTS = require('../constants');

const ObjectId = mongoose.Types.ObjectId;

class GroupService extends SuperService {
    getGroupProjection(groupModel) {
        const result = groupModel.toJSON ? groupModel.toJSON() : groupModel;

        return {
            _id : result._id,
            name: result.name
        }
    }

    fetchGroups(page, limit, search) {
        const skip = (page - 1) * limit;
        const match = {};
        const aggregatePipelines = [];
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');

        if (search) {
            match.name = searchRegExp;
        }

        aggregatePipelines.push(
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
                    _id : 1,
                    name: 1,
                }
            }
        );

        return Promise.all([
            this.count(match),
            this.aggregate(aggregatePipelines)
        ]);
    }

    getGroupById(groupId) {
        const aggregatePipelines = [];

        aggregatePipelines.push(
            {
                $match: {
                    _id: ObjectId(groupId)
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.SUBJECTS,
                    localField  : 'subjects',
                    foreignField: '_id',
                    as          : 'subjects'
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : 'students',
                    foreignField: '_id',
                    as          : 'students'
                }
            },
            {
                $project: {
                    _id     : 1,
                    name    : 1,
                    students: {
                        $map: {
                            input: "$students",
                            as   : "item",
                            in   : {
                                _id   : '$$item._id',
                                name  : {$concat: ['$$item.firstName', ' ', '$$item.lastName']},
                                email : '$$item.email',
                                avatar: '$$item.avatar',
                            }
                        }
                    },
                    subjects: {
                        $map: {
                            input: "$subjects",
                            as   : "item",
                            in   : {
                                _id : '$$item._id',
                                name: '$$item.name'
                            }
                        }
                    }
                }
            }
        );

        return this.aggregateOne(aggregatePipelines);
    }

    getGroupsBySubject(subjectId, page, limit, search) {
        const skip = (page - 1) * limit;
        const match = {};
        const aggregatePipelines = [];
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');

        match.subjects = {
            $in: [ObjectId(subjectId)]
        };

        if (search) {
            match.name = searchRegExp;
        }

        aggregatePipelines.push(
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
                    _id : 1,
                    name: 1,
                }
            }
        );

        return Promise.all([
            this.count(match),
            this.aggregate(aggregatePipelines)
        ]);
    }

    getStudentsListWithPoints(groupId, subjectId) {
        const aggregatePipelines = [
            {
                $match: {
                    _id: ObjectId(groupId)
                }
            },
            {
                $unwind: {
                    path: '$students'
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.POINTS,
                    localField  : 'students',
                    foreignField: 'student',
                    as          : 'points'
                }
            },
            {
                $addFields: {
                    points: {
                        $filter: {
                            input: "$points",
                            as   : "point",
                            cond : {$eq: ["$$point.subject", ObjectId(subjectId)]}
                        }
                    }
                }
            },
            {
                $unwind: {
                    path                      : '$points',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.POINT_TYPES,
                    localField  : 'points.typeOfPoint',
                    foreignField: '_id',
                    as          : 'points.pointName'
                }
            },
            {
                $addFields: {
                    'points.pointName': {$arrayElemAt: ['$points.pointName', 0]}
                }
            },
            {
                $group: {
                    _id   : '$students',
                    points: {$push: '$points'}
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : '_id',
                    foreignField: '_id',
                    as          : 'name'
                }
            },
            {
                $addFields: {
                    name  : {$arrayElemAt: ['$name', 0]},
                    points: {
                        $map: {
                            input: "$points",
                            as   : "point",
                            in   : {
                                pointName: '$$point.pointName.name',
                                value    : '$$point.value'
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    name: {$concat: ['$name.firstName', ' ', '$name.lastName']}
                }
            },
            {
                $sort: {
                    name: 1
                }
            }
        ];

        return this.aggregate(aggregatePipelines);
    }


    getGroupOfStudent(studentId) {
        const aggregatePipelines = [
            {
                $match: {
                    students: {$in: [ObjectId(studentId)]}
                }
            },
            {
                $unwind: {
                    path: '$students'
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : '_id',
                    foreignField: '_id',
                    as          : 'name'
                }
            },
            {
                $addFields: {
                    name: {$arrayElemAt: ['$name', 0]}
                }
            },
            {
                $addFields: {
                    name: {$concat: ['$name.firstName', ' ', '$name.lastName']}
                }
            },
            {
                $sort: {
                    name: 1
                }
            },
            {
                $project: {
                    _id   : 1,
                    name  : 1,
                    avatar: 1,
                    email : 1
                }
            }
        ];

        return this.aggregate(aggregatePipelines);
    }
}

module.exports = new GroupService(GroupModel);
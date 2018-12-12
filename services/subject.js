'use strict';

const mongoose = require('mongoose');

const SubjectModel = require('../models/subject');

const SuperService = require('./super');

const CONSTANTS = require('../constants');

const ObjectId = mongoose.Types.ObjectId;

class SubjectService extends SuperService {

    getSubjectProjection(groupModel) {
        const result = groupModel.toJSON ? groupModel.toJSON() : groupModel;

        return {
            _id : result._id,
            name: result.name
        }
    }

    fetchSubjects(page, limit, search, param) {
        const skip = (page - 1) * limit;
        const match = {};
        const aggregatePipelines = [];
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');

        if (search) {
            match.name = searchRegExp;
        }

        if (param) {
            Object.assign(match, param);
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

    getSubjectById(subjectId) {
        const aggregatePipelines = [];

        aggregatePipelines.push(
            {
                $match: {
                    _id: ObjectId(subjectId)
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : 'teacher',
                    foreignField: '_id',
                    as          : 'teacher'
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.GROUPS,
                    localField  : '_id',
                    foreignField: 'subjects',
                    as          : 'groups'
                }
            },
            {
                $addFields: {
                    teacher: {$arrayElemAt: ['$teacher', 0]},
                    groups : {
                        $map: {
                            input: '$groups',
                            as   : 'group',
                            in   : {
                                _id : '$$group._id',
                                name: '$$group.name'
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id    : 1,
                    name   : 1,
                    teacher: {
                        _id   : '$teacher._id',
                        email : '$teacher.email',
                        name  : {$concat: ['$teacher.firstName', ' ', '$teacher.lastName']},
                        avatar: '$teacher.avatar'
                    },
                    groups : 1
                }
            }
        );

        return this.aggregateOne(aggregatePipelines);
    }

    getSubjectsByTeacherId(teacherId, page, limit, search) {
        const skip = (page - 1) * limit;
        const match = {
            teacher: ObjectId(teacherId)
        };
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

}

module.exports = new SubjectService(SubjectModel);
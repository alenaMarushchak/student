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
            //TODO add lookup
            {
                $project: {
                    _id     : 1,
                    name    : 1,
                    students: 1,
                    subjects: 1,
                }
            }
        );

        return this.aggregateOne(aggregatePipelines);
    }
}

module.exports = new GroupService(GroupModel);
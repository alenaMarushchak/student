'use strict';

const mongoose = require('mongoose');

const CommentModel = require('../models/comment');

const SuperService = require('./super');

const CONSTANTS = require('../constants');

const ObjectId = mongoose.Types.ObjectId;

class CommentService extends SuperService {
    fetch(postId, page, limit) {
        const skip = (page - 1) * limit;
        const match = {
            post: ObjectId(postId)
        };
        const aggregatePipelines = [];

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
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : 'author',
                    foreignField: '_id',
                    as          : 'author'
                }
            },
            {
                $addFields: {
                    author: {$arrayElemAt: ['$author', 0]},
                    likes : {$size: '$likes'}
                }
            },
            {
                $project: {
                    _id      : 1,
                    test     : 1,
                    author   : {
                        _id : '$author._id',
                        name: {$concat: ['$author.firstName', ' ', '$author.lastName']}
                    },
                    createdAt: 1
                }
            }
        );

        return Promise.all([
            this.count(match),
            this.aggregate(aggregatePipelines)
        ]);
    }

    getCommentProfile(commentId) {
        const aggregatePipelines = [
            {
                $match: {
                    _id: ObjectId(commentId)
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : 'author',
                    foreignField: '_id',
                    as          : 'author'
                }
            },
            {
                $addFields: {
                    author: {$arrayElemAt: ['$author', 0]},
                    likes : {$size: '$likes'}
                }
            },
            {
                $project: {
                    _id      : 1,
                    test     : 1,
                    author   : {
                        _id : '$author._id',
                        name: {$concat: ['$author.firstName', ' ', '$author.lastName']}
                    },
                    createdAt: 1
                }
            }
        ];

        return this.aggregateOne(aggregatePipelines);
    }
}

module.exports = new CommentService(CommentModel);
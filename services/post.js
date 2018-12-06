'use strict';
const mongoose = require('mongoose');

const PostModel = require('../models/post');

const SuperService = require('./super');

const CONSTANTS = require('../constants');

const ObjectId = mongoose.Types.ObjectId;

class PostService extends SuperService {
    fetch(blogId, page, limit, search) {
        const skip = (page - 1) * limit;
        const match = {
            blog: ObjectId(blogId)
        };
        const aggregatePipelines = [];
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');

        if (search) {
            match.title = {
                $regex: searchRegExp
            };

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
                $lookup: {
                    from        : CONSTANTS.COLLECTION.USERS,
                    localField  : 'author',
                    foreignField: '_id',
                    as          : 'author'
                }
            },
            {
                $lookup: {
                    from        : CONSTANTS.COLLECTION.COMMENTS,
                    localField  : '_id',
                    foreignField: 'post',
                    as          : 'commentCount'
                }
            },
            {
                $addFields: {
                    author      : {$arrayElemAt: ['$author', 0]},
                    commentCount: {$size: '$commentCount'},
                    likes       : {$size: '$likes'}
                }
            },
            {
                $project: {
                    _id         : 1,
                    title       : 1,
                    description : {$concat: [{$substrCP: ['$description', 0, 60]}, '...']},
                    likes       : 1,
                    tags        : 1,
                    author      : {
                        _id : '$author._id',
                        name: {$concat: ['$author.firstName', ' ', '$author.lastName']}
                    },
                    createdAt   : 1,
                    commentCount: 1
                }
            }
        );

        return Promise.all([
            this.count(match),
            this.aggregate(aggregatePipelines)
        ]);
    }

    getPostProfile(postId) {
        const aggregatePipelines = [
            {
                $match: {
                    _id: ObjectId(postId)
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
                $lookup: {
                    from        : CONSTANTS.COLLECTION.COMMENTS,
                    localField  : '_id',
                    foreignField: 'post',
                    as          : 'commentCount'
                }
            },
            {
                $addFields: {
                    author      : {$arrayElemAt: ['$author', 0]},
                    commentCount: {$size: '$commentCount'},
                    likes       : {$size: '$likes'}
                }
            },
            {
                $project: {
                    _id         : 1,
                    title       : 1,
                    description : 1,
                    attachments : 1,
                    likes       : 1,
                    tags        : 1,
                    author      : {
                        _id : '$author._id',
                        name: {$concat: ['$author.firstName', ' ', '$author.lastName']}
                    },
                    createdAt   : 1,
                    commentCount: 1
                }
            }
        ];

        return this.aggregateOne(aggregatePipelines);
    }
}

module.exports = new PostService(PostModel);
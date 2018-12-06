'use strict';

const mongoose = require('mongoose');

const BlogModel = require('../models/blog');

const SuperService = require('./super');

const CONSTANTS = require('../constants');

const ObjectId = mongoose.Types.ObjectId;

class BlogService extends SuperService {

    getBlogProfile(blogId) {
        const aggregatePipelines = [
            {
                $match: {
                    _id: ObjectId(blogId)
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
                    from        : CONSTANTS.COLLECTION.POSTS,
                    localField  : '_id',
                    foreignField: 'blog',
                    as          : 'postCount'
                }
            },
            {
                $addFields: {
                    author   : {$arrayElemAt: ['$author', 0]},
                    postCount: {$size: '$postCount'}
                }
            },
            {
                $project: {
                    _id      : 1,
                    name     : 1,
                    tags     : 1,
                    author   : {
                        _id : '$author._id',
                        name: {$concat: ['$author.firstName', ' ', '$author.lastName']}
                    },
                    createdAt: 1,
                    postCount: 1
                }
            }
        ];

        return this.aggregateOne(aggregatePipelines);
    }

    fetch(page, limit, search) {
        const skip = (page - 1) * limit;
        const match = {};
        const aggregatePipelines = [];
        const searchRegExp = new RegExp('.*' + search + '.*', 'ig');

        if (search) {
            match.$or = [
                {
                    name: {
                        $regex: searchRegExp
                    }
                },
                {
                    tags: {
                        $in: [search]
                    }
                }
            ];
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
                    from        : CONSTANTS.COLLECTION.POSTS,
                    localField  : '_id',
                    foreignField: 'blog',
                    as          : 'postCount'
                }
            },
            {
                $addFields: {
                    author   : {$arrayElemAt: ['$author', 0]},
                    postCount: {$size: '$postCount'}
                }
            },
            {
                $project: {
                    _id      : 1,
                    name     : 1,
                    tags     : 1,
                    author   : {
                        _id : '$author._id',
                        name: {$concat: ['$author.firstName', ' ', '$author.lastName']}
                    },
                    createdAt: 1,
                    postCount: 1
                }
            }
        );

        return Promise.all([
            this.count(match),
            this.aggregate(aggregatePipelines)
        ]);
    }
}

module.exports = new BlogService(BlogModel);
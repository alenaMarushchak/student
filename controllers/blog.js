const _ = require('lodash');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const blogService = require('../services/blog');
const postService = require('../services/post');
const commentService = require('../services/comment');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const CustomError = require('../helpers/CustomError');
const {pagination, pages} = require('../helpers/parser');
const fileHelper = require('../helpers/files');
const computeUrl = require('../helpers/computeUrl');

class BlogController {

    async getBlogList(req, res) {
        const query = req.query;

        let {search} = query;

        if (search) {
            search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&");
        }
        const {page, limit} = pagination(query);

        let [total, data = []] = await blogService.fetch(page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async createBlog(req, res) {
        let {session: {userId}, body: {name, tags = []}} = req;

        name = _.escape(name);
        tags = tags && tags.map(item => _.escape(item));

        const blogWithSameName = await blogService.findOne({name});

        if (blogWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('blog with same name'));
        }

        const blogModel = await blogService.save({
            author: ObjectId(userId),
            name,
            tags,
        });

        const blogId = blogModel.get('_id');

        const blogProfile = await blogService.getBlogProfile(blogId);

        res.status(201).send(blogProfile);
    }

    async deleteBlog(req, res) {
        let {session: {userId}, params: {id: blogId}} = req;

        const blogModel = await blogService.findById(blogId);

        if (!blogModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('blog'));
        }

        let postIds = await postService.find({blog: ObjectId(blogId)});

        postIds = postIds.map(post => post.get('_id'));

        await commentService.deleteMany({post: {$in: postIds}});

        await postService.deleteMany({blog: ObjectId(blogId)});

        await blogService.deleteOne({_id: ObjectId(blogId)});

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove blog')});
    }

    async getPostList(req, res) {
        const {params: {id: blogId}, query} = req;

        const blogModel = await blogService.findById(blogId);

        if (!blogModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('blog'));
        }

        let {search} = query;

        if (search) {
            search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&");
        }
        const {page, limit} = pagination(query);

        let [total, data = []] = await postService.fetch(blogId, page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async createPost(req, res) {
        let {
            session: {
                userId
            }, body: {
                title, description
            },
            params : {
                id: blogId
            }
        } = req;

        const blogModel = await blogService.findById(blogId);

        if (!blogModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('blog'));
        }

        if (blogModel.author.toString() !== userId.toString()) {
            throw new CustomError(403, ERROR_MESSAGES.FORBIDDEN);
        }

        const postWithSameTitle = await postService.findOne({title});

        if (postWithSameTitle) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('post with same title'));
        }

        const postModel = await postService.save({
            title,
            description,
            blog  : ObjectId(blogId),
            author: ObjectId(userId)
        });

        const postId = postModel.get('_id');

        const postProfile = await postService.getPostProfile(postId);

        res.status(201).send(postProfile);
    }

    async deletePost(req, res) {
        let {
            session: {
                userId
            },
            params : {
                id: postId,
            }
        } = req;

        const postModel = await postService.findById(postId);

        if (!postModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('post'));
        }

        await commentService.deleteMany({post: ObjectId(postId)});

        await postService.deleteOne({_id: ObjectId(postId)});

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('delete post')});

    }

    async getPostById(req, res) {
        let {
            session: {
                userId
            },
            params : {
                id: postId,
            }
        } = req;

        const postModel = await postService.findById(postId);

        if (!postModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('post'));
        }

        const postProfile = await postService.getPostProfile(ObjectId(postId));

        res.status(200).send(postProfile)
    }

}

module.exports = new BlogController();
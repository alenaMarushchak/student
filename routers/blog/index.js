const express = require('express');

const blogController = require('../../controllers/blog');

const {isAdmin, isTeacher} = require('../../helpers/sessionService');

const {validatorMiddleware} = require('../../helpers/validator');

const router = express.Router();

router.get('/', blogController.getBlogList);

router.post('/', validatorMiddleware().body('BLOG_CREATE').middleware(),isTeacher, blogController.createBlog);

router.delete('/', isAdmin, blogController.deleteBlog);

router.get('/post/:id', validatorMiddleware().params('ID').middleware(), blogController.getPostById);

router.get('/:id/post', validatorMiddleware().params('ID').middleware(), blogController.getPostList);

router.post('/:id/post', validatorMiddleware().params('ID').middleware(),
    validatorMiddleware().body('POST_CREATE').middleware(),
    isTeacher,
    blogController.createPost);

router.delete('/post/:id', validatorMiddleware().params('ID').middleware(), isAdmin, blogController.deletePost);


module.exports = router;

const _ = require('lodash');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const groupService = require('../services/group');
const subjectService = require('../services/subject');
const userService = require('../services/user');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const {pagination, pages} = require('../helpers/parser');
const computeUrl = require('../helpers/computeUrl');

const CustomError = require('../helpers/CustomError');

class GroupController {

    async createGroup(req, res) {
        const body = req.body;

        let {name, subjects} = body;

        if (!Array.isArray(subjects)) {
            throw new CustomError(404, ERROR_MESSAGES.INCORRECT('subjects'));
        }


        if (subjects.length) {
            subjects = subjects.map(item => ObjectId(item._id));

            const subjectModels = await await subjectService.find({
                _id: {$in: subjects}
            });

            if (!subjectModels.length) {
                throw new CustomError(400, ERROR_MESSAGES.INCORRECT('subject'));
            }
        }

        const groupWithSameName = await groupService.findOne({name});

        if (groupWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('Name'));
        }

        const groupModel = await groupService.save({
            name,
            subjects
        });

        res.status(201).send(groupService.getGroupProjection(groupModel));
    }

    async updateGroup(req, res) {
        const {body, params: {id: groupId}} = req;
        const updateObj = {};

        let {name, subjects, students} = body;

        const groupForUpdate = await groupService.findById(groupId);

        if (!groupForUpdate) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        if (name && groupForUpdate.get('name') !== name) {
            updateObj.name = name;
        }

        const groupWithSameName = await groupService.findOne({name});

        if (groupWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('name'));
        }

        if (students) {

            if (students.length) {
                students = students.map(item => ObjectId(item._id));

                const studentModels = await userService.find({
                    role: CONSTANTS.ROLES.STUDENT,
                    _id : {$in: students}
                });

                if (!studentModels.length) {
                    throw new CustomError(400, ERROR_MESSAGES.INCORRECT('student'));
                }
            }

            updateObj.students = students;
        }

        if (subjects) {

            if (subjects.length) {
                subjects = subjects.map(item => ObjectId(item._id));

                const subjectModels = await await subjectService.find({
                    _id: {$in: subjects}
                });

                if (!subjectModels.length) {
                    throw new CustomError(400, ERROR_MESSAGES.INCORRECT('subject'));
                }
            }

            updateObj.subjects = subjects;
        }

        const groupModel = await groupService.findByIdAndUpdate(
            groupId,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );


        res.status(200).send(groupService.getGroupProjection(groupModel));
    }

    async deleteGroup(req, res) {
        const {params: {id: groupId}} = req;

        await groupService.remove(
            {
                _id: groupId,
            }
        );

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove group')});
    }

    async getGroupsList(req, res) {
        const query = req.query;

        const {page, limit} = pagination(query || {});

        let {search} = query;

        search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&").replace(/ +$/, '');

        const [total, data = []] = await groupService.fetchGroups(page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async getGroupById(req, res) {
        const {params: {id: groupId}} = req;

        const groupProfile = await groupService.getGroupById(groupId);

        if (!groupProfile) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        if (groupProfile.students && groupProfile.students.length) {
            groupProfile.students = groupProfile.students.map(item => {
                if (item.avatar) {
                    item.avatar = computeUrl(item.avatar, CONSTANTS.FILES.BUCKETS.AVATAR)
                }

                return item;
            });
        }

        res.status(200).send(groupProfile);
    }

    async getGroupsBySubject(req, res) {
        const {params: {id: subjectId}, query} = req;

        const {page, limit} = pagination(query || {});

        let {search} = query;

        if (search) {
            search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&").replace(/ +$/, '');
        }

        const [total, data = []] = await groupService.getGroupsBySubject(subjectId, page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async getStudentsOfGroupWithPoints(req, res) {
        const {params: {id, subjectId}} = req;

        const data = await groupService.getStudentsListWithPoints(id, subjectId);

        res.status(200).send(data);
    }

    async getMyGroup(req, res) {
        const {session: {userId}} = req;

        let groupProfile = await groupService.getGroupOfStudent(userId);

        if (!groupProfile) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        if (groupProfile.students && groupProfile.students.length) {
            groupProfile.students = groupProfile.students.map(item => {
                if (item.avatar) {
                    item.avatar = computeUrl(item.avatar, CONSTANTS.FILES.BUCKETS.AVATAR)
                }

                return item;
            });
        }

        res.status(200).send(groupProfile);
    }
}

module.exports = new GroupController();
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
const {each} = require('../helpers/async');

const CustomError = require('../helpers/CustomError');

class GroupController {

    async createGroup(req, res) {
        const body = req.body;

        let {name, subjects} = body;

        if (!Array.isArray(subjects)) {
            throw new CustomError(404, ERROR_MESSAGES.INCORRECT('subjects'));
        }

        subjects = subjects.map(item => ObjectId(item._id));

        if (subjects.length) {
            each(subjects, async function (subjectId) {
                const subjectModel = await subjectService.findById(subjectId);

                if (!subjectModel) {
                    throw new CustomError(400, ERROR_MESSAGES.INCORRECT('subject'));
                }
            })
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

        let {name, subjects = []} = body;

        const groupForUpdate = await groupService.findById(groupId);

        if (!groupForUpdate) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        if (!Array.isArray(subjects)) {
            throw new CustomError(404, ERROR_MESSAGES.INCORRECT('subjects'));
        }

        subjects = subjects.map(item => ObjectId(item._id));

        if (subjects.length) {
            each(subjects, async function (subjectId) {
                const subjectModel = await subjectService.findById(subjectId);

                if (!subjectModel) {
                    throw new CustomError(400, ERROR_MESSAGES.INCORRECT('subject'));
                }
            })
        }

        const updateObj = {};

        if (groupForUpdate.get('name') !== name) {
            updateObj.name = name;
        }

        updateObj.subjects = subjects;

        if (!Object.keys(updateObj).length) {
            throw new CustomError(400, ERROR_MESSAGES.NOTHING_TO_UPDATE);
        }

        const groupWithSameName = await groupService.findOne({name});

        if (groupWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('name'));
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

        const {page, limit} = pagination(query);

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

        res.status(200).send(groupProfile);
    }

    async getGroupsBySubject(req, res) {
        const {params: {id: subjectId}, query} = req;

        const {page, limit} = pagination(query);

        let {search} = query;

        search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&").replace(/ +$/, '');

        const [total, data = []] = await groupService.getGroupsBySubject(subjectId, page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async addRemoveStudentsFromGroup(req, res) {
        let {params: {id: groupId}, body: {students}} = req;

        const groupProfile = await groupService.getGroupById(groupId);

        if (!groupProfile) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        if (!Array.isArray(students)) {
            throw new CustomError(404, ERROR_MESSAGES.INCORRECT('subjects'));
        }

        students = students.map(item => ObjectId(item._id));

        if (students.length) {
            each(students, async function (studentId) {
                const studentModel = await userService.findOne({
                    _id : ObjectId(studentId),
                    role: CONSTANTS.ROLES.STUDENT
                });

                if (!studentModel) {
                    throw new CustomError(400, ERROR_MESSAGES.INCORRECT('student'));
                }
            })
        }

        groupProfile.set('students', students);

        await groupProfile.save();

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('added students to group')});
    }
}

module.exports = new GroupController();
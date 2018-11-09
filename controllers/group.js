const _ = require('lodash');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const groupService = require('../services/group');
const subjectService = require('../services/subject');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const {pagination, pages} = require('../helpers/parser');

const CustomError = require('../helpers/CustomError');

class GroupController {

    async createGroup(req, res) {
        const body = req.body;

        const {name} = body;

        const groupWithSameName = await groupService.findOne({name});

        if (groupWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('Name'));
        }

        const groupModel = await groupService.save({
            name,
        });

        res.status(201).send(groupService.getGroupProjection(groupModel));
    }

    async updateGroup(req, res) {
        const {body, params: {id: groupId}} = req;

        const {name} = body;

        const groupForUpdate = await groupService.findById(groupId);

        if (!groupForUpdate) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        const updateObj = {};

        if (groupForUpdate.get('name') !== name) {
            updateObj.name = name;
        }

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

    async addSubjectToGroup(req, res) {
        const {id: groupId, subjectId} = req.params;

        const groupDocument = await groupService.findById(groupId).lean();

        if (!groupDocument) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        const subjectDocument = await subjectService.findById(subjectId).lean();

        if (!subjectDocument) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('subject'));
        }

        const {subjects} = groupDocument;

        let hasSubject = subjects.find(subject => subject.toString() === subjectId);

        if (hasSubject) {
            return res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('add subject')});
        }

        await groupService.updateOne(
            {_id: groupId},
            {
                $push: {
                    subjects: ObjectId(subjectId)
                }
            }
        );

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('add subject')});

    }

    async removeSubjectFromGroup(req, res) {
        const {id: groupId, subjectId} = req.params;

        const groupDocument = await groupService.findById(groupId).lean();

        if (!groupDocument) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('group'));
        }

        const subjectDocument = await subjectService.findById(subjectId).lean();

        if (!subjectDocument) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('subject'));
        }

        const {subjects} = groupDocument;

        let hasSubject = subjects.find(subject => subject.toString() === subjectId);

        if (!hasSubject) {
            return res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove subject')});
        }

        await groupService.updateOne(
            {_id: groupId},
            {
                $pull: {
                    subjects: ObjectId(subjectId)
                }
            }
        );

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove subject')});
    }
}

module.exports = new GroupController();
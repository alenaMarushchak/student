const _ = require('lodash');
const mongoose = require('mongoose');

const subjectService = require('../services/subject');
const groupService = require('../services/group');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const {pagination, pages} = require('../helpers/parser');

const CustomError = require('../helpers/CustomError');

const ObjectId = mongoose.Types.ObjectId;

class SubjectController {

    async createSubject(req, res) {
        const body = req.body;

        const {name} = body;

        const subjectWithSameName = await subjectService.findOne({name});

        if (subjectWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('Name'));
        }

        const subjectModel = await subjectService.save({
            name,
        });

        res.status(201).send(subjectService.getSubjectProjection(subjectModel));
    }

    async updateSubject(req, res) {
        const {body, params: {id: subjectId}} = req;

        const {name} = body;

        const subjectForUpdate = await subjectService.findById(subjectId);

        if (!subjectForUpdate) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('Subject'));
        }

        const updateObj = {};

        if (subjectForUpdate.get('name') !== name) {
            updateObj.name = name;
        }

        if (!Object.keys(updateObj).length) {
            throw new CustomError(400, ERROR_MESSAGES.NOTHING_TO_UPDATE);
        }

        const subjectWithSameName = await subjectService.findOne({name});

        if (subjectWithSameName) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('name'));
        }

        const subjectModel = await subjectService.findByIdAndUpdate(
            subjectId,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );


        res.status(200).send(subjectService.getSubjectProjection(subjectModel));
    }

    async deleteSubject(req, res) {
        const {params: {id: subjectId}} = req;

        await subjectService.remove(
            {
                _id: subjectId,
            }
        );

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove Subject')});
    }

    async getSubjectsList(req, res) {
        const query = req.query;

        const {page, limit} = pagination(query);

        let {search} = query;

        search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&").replace(/ +$/, '');

        const [total, data = []] = await subjectService.fetchSubjects(page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async getSubjectsListWithoutCurrentTeacher(req, res) {
        const {
            session: {
                userId
            },
            query
        } = req;

        const {page, limit} = pagination(query);

        let {search} = query;

        search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&").replace(/ +$/, '');

        const [total, data = []] = await subjectService.fetchSubjects(
            page,
            limit,
            search,
            {
                teacher: {$ne: ObjectId(userId)}
            }
        );

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async getSubjectById(req, res) {
        const {params: {id: subjectId}} = req;

        const subjectProfile = await subjectService.getSubjectById(subjectId);

        if (!subjectProfile) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('subject'));
        }


        res.status(200).send(subjectProfile);
    }

    async getTeahersSubject(req, res) {
        const {
            session: {
                userId
            },
            query
        } = req;

        const {page, limit} = pagination(query);

        let {search} = query;

        search = search.replace(CONSTANTS.VALIDATION.SPEC_SYMBOLS, "\\$&").replace(/ +$/, '');

        const [total, data = []] = await subjectService.getSubjectsByTeacherId(userId, page, limit, search);

        const meta = {
            page,
            limit,
            total,
            pages: pages(total, limit)
        };

        res.status(200).send({meta, data});
    }

    async addTeacherToSubject(req, res) {
        const {
            session: {
                userId
            },
            params : {
                id
            }
        } = req;

        const subjectModel = await subjectService.findById(id);

        if (!subjectModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('subject'));
        }

        const teacher = subjectModel.get('teacher');

        if (teacher && (teacher.toString() === userId.toString())) {
            return res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('add teacher to subject')});
        }

        if (teacher) {
            throw new CustomError(400, ERROR_MESSAGES.ALREADY_EXISTS('teacher'));
        }

        subjectModel.set('teacher', ObjectId(userId));

        await subjectModel.save();

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('add teacher to subject')});
    }

    async removeTeacherFromSubject(req, res) {
        const {
            session: {
                userId
            },
            params : {
                id
            }
        } = req;

        const subjectModel = await subjectService.findById(id);

        if (!subjectModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('subject'));
        }

        const teacher = subjectModel.get('teacher');

        if (teacher.toString() !== userId.toString()) {
            return res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove teacher from subject')});
        }

        subjectModel.set('teacher', null);

        await subjectModel.save();

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('remove teacher from subject')});
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
}

module.exports = new SubjectController();
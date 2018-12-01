const _ = require('lodash');
const mongoose = require('mongoose');

const pointTypeService = require('../services/pointType');
const pointService = require('../services/point');
const subjectService = require('../services/subject');
const userService = require('../services/user');
const groupService = require('../services/group');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const {pagination, pages} = require('../helpers/parser');

const CustomError = require('../helpers/CustomError');

const ObjectId = mongoose.Types.ObjectId;

class SubjectController {

    async addEditPoint(req, res) {
        const {
            params : {id: pointTypeId},
            body   : {
                subjectId,
                studentId,
                value
            },
            session: {
                userId
            }
        } = req;

        const [
            pointTypeModel,
            studentModel,
            subjectModel,
            groupModel
        ] = await Promise.all([

            pointTypeService.findById(pointTypeId),

            userService.findOne({
                _id : ObjectId(studentId),
                role: CONSTANTS.ROLES.STUDENT
            }),

            subjectService.findById(subjectId),

            groupService.findOne({
                students: {$in: [ObjectId(studentId)]},
                subjects: {$in: [ObjectId(subjectId)]}
            })
        ]);

        if (!groupModel) {
            throw new CustomError(400, ERROR_MESSAGES.INCORRECT('such student does not have this subject'));
        }
        if (!subjectModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('subject'));
        }
        if (!pointTypeModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('point type'));
        }
        if (!studentModel) {
            throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND('student'));
        }

        if (subjectModel.teacher !== userId) {
            throw new CustomError(403, ERROR_MESSAGES.FORBIDDEN);
        }

        await pointService.updateOne({
                type   : ObjectId(pointTypeId),
                student: ObjectId(),
                subject: ObjectId()
            },
            {
                value,
                teacher: userId
            },
            {
                upsert: true
            });

        res.status(200).send({message: RESPONSE_MESSAGES.SUCCESS('add point')})

    }
}

module.exports = new SubjectController();
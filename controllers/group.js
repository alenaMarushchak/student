const _ = require('lodash');

const groupService = require('../services/group');

const ERROR_MESSAGES = require('../constants/error');
const RESPONSE_MESSAGES = require('../constants/response');
const CONSTANTS = require('../constants/index');

const {pagination, pages} = require('../helpers/parser');

const CustomError = require('../helpers/CustomError');


class UserController {

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

        const {search} = query;

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
}

module.exports = new UserController();
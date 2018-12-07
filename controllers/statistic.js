const _ = require('lodash');

const userService = require('../services/user');
const subjectService = require('../services/subject');
const groupService = require('../services/group');


class StatisticController {

    async getAdminStatistic(req, res) {
        let userData = await userService.getUserStatistic();
        let groupData = await groupService.getGroupStatistic();

        const createArray = (data) => {
            let keys = Object.keys(data);

            return keys.map(key => {
                return {
                    name : key,
                    value: data[key]
                }
            });
        };

        let result = {
            users : createArray(userData),
            groups: groupData
        };

        res.status(200).send(result);
    }

    async getStudentStatistic(req, res) {
        const groupStatistic = await groupService.getStundentsGroupStatistic();

        res.status(200).send(groupStatistic);
    }
}

module.exports = new StatisticController();
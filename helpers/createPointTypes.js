const pointTypeService = require('../services/pointType');
const CONSTANTS = require('../constants/index');

module.exports = async function () {
    try {
        const pointTypes = await pointTypeService.find({
            name: {
                $in: [
                    CONSTANTS.POINT_TYPES.MODULE1,
                    CONSTANTS.POINT_TYPES.MODULE2,
                    CONSTANTS.POINT_TYPES.EXAM
                ]
            }
        });

        if (!pointTypes || pointTypes.length < 3) {
            await pointTypeService.insertMany([
                {
                    name: CONSTANTS.POINT_TYPES.MODULE1
                },
                {
                    name: CONSTANTS.POINT_TYPES.MODULE2
                },
                {
                    name: CONSTANTS.POINT_TYPES.EXAM
                }
            ]);

            console.log('==== Point types created successfully======');
        }
    } catch (err) {
        console.error(err);
    }
};
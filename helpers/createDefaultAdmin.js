const userService = require('../services/user');
const config = require('../config/index');
const CONSTANTS = require('../constants/index');

const security = require('./security');

module.exports = async function () {
    try {
        const {admin} = config;

        const adminModel = await userService.findOne({role: CONSTANTS.ROLES.ADMIN});

        if (!adminModel) {

            let hashPassword = await security.hash(admin.password);

            const adminProfile = {
                firstName: 'Admin',
                lastName : 'Admin',
                role     : CONSTANTS.ROLES.ADMIN,
                email    : admin.email,
                password : hashPassword
            };

            await userService.save(adminProfile);

            console.log('Admin created successfully');
        }

    } catch (err) {
        console.error(err);
    }
};
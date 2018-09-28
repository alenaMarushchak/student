module.exports = {
    UNAUTHORIZED             : 'Unauthorized',
    SOMETHING_WRONG_TRY_LATER: 'Something wrong, try later',
    PASS_ALL_REQUIRED_FIELDS : 'Please pass all required fields',
    NOT_FOUND                : obj => `${obj} not found`,
    INCORRECT                : obj => `Incorrect - ${obj}.`,
    ALREADY_EXISTS           : obj => `${obj} already exists`,
    PASS_REQUIRED_FIELD      : fieldName => `Required fields: ${fieldName}`,
    FORBIDDEN                : 'Forbidden',
    NOTHING_TO_UPDATE        : 'Nothing to update'
};
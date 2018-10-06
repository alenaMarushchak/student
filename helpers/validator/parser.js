'use strict';

module.exports = err => {
    if (!err || typeof err !== 'object') {
        return 'Some fields is invalid';
    }

    const errorResult = [];

    for (const [key, value] of Object.entries(err)) {
        const errorText = value.reduce((previousValue, currentValue) => `${previousValue} ${currentValue},`, '');

        errorResult.push(`${key}: ${errorText}`);
    }

    return errorResult.join('; ');
};
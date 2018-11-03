'use strict';

module.exports = (req, res, next) => {
    try {
        const {file, files} = req;

        if (file) {
            file.url = file.path.replace(/\\/g, '/');
        }

        if (files) {
            Object.keys(files).forEach(key => {
                const item = files[key];

                if (item instanceof Array) {
                    return item.forEach(file => file.url = file.path.replace(/\\/g, '/'));
                }

                item.url = item.path.replace(/\\/, '/');
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};

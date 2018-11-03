const multer = require('multer');

const limitsConfig = ['fieldNameSize', 'fieldSize', 'fields', 'fileSize', 'files', 'parts', 'headerPairs'];

function fileFilterErrorHandler(throwError, cb) {
    if (throwError) {
        return cb(new Error('Don\'t valid file'));
    }

    cb(null, false);
}

function getExtension(fieldname) {
    const extension = fieldname.split('.').pop();

    return extension ? `.${extension}` : '';
}

class FilesLocalStorage {

    constructor() {
        this.opts = {};
    }

    middleware() {
        return multer(this.opts);
    }

    diskStorage(destination, filename, withExtension = true) {
        const storage = {};

        if (typeof destination === 'string') {
            storage.destination = (req, file, cb) => {
                cb(null, destination);
            };
        } else if (typeof destination === 'function') {
            storage.destination = destination;
        } else {
            throw new Error('Incorrect destination');
        }

        if (typeof filename === 'string') {
            storage.filename = (req, file, cb) => {
                cb(null, filename + (withExtension ? getExtension(file.originalname) : ''));
            };
        } else if (typeof filename === 'function') {
            storage.filename = (req, file, cb) => {
                cb(null, filename(file) + (withExtension ? getExtension(file.originalname) : ''));
            };
        } else {
            throw new Error('Incorrect filename');
        }

        this.opts.storage = multer.diskStorage(storage);

        return this;
    }

    limits(opts) {
        const limits = {};

        this.opts.limits = limits;

        limitsConfig.forEach(property => {
            opts.hasOwnProperty(property) && (limits[property] = opts[property]);
        });

        return this;
    }

    fileFilter(obj, throwError = false) {
        if (typeof obj === 'function') {
            this.opts.fileFilter = obj;
        } else if (typeof obj === 'object') {
            this.opts.fileFilter = (req, file, cb) => {
                const fieldname = file.fieldname;

                if (obj instanceof Array) {
                    if (!obj.includes(file.mimetype)) {
                        return fileFilterErrorHandler(throwError, cb);
                    }
                } else {
                    if (obj[fieldname] && !obj[fieldname].includes(file.mimetype)) {
                        return fileFilterErrorHandler(throwError, cb);
                    }
                }

                return cb(null, true);
            };
        } else {
            throw new Error('Incorrect file filter');
        }

        return this;
    }

}

module.exports = () => new FilesLocalStorage();
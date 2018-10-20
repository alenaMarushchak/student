class CustomError extends Error {
    constructor(status, message) {
        super(message);

        Error.captureStackTrace(this);

        this.status = status;
    }
}

module.exports = CustomError;

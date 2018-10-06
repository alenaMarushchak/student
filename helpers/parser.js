module.exports.pagination = ({page, limit}, maxLimit = 50) => {
    page = Math.abs(parseInt(page, 10));
    limit = Math.abs(parseInt(limit, 10));

    page || (page = 1);
    (!limit || limit > maxLimit) && (limit = maxLimit);

    return {page, limit};
};

module.exports.pages = (total, limit) => {
    let pages = total / limit;

    return pages % 1 === 0 ? pages : pages + 1 ^ 0;
};
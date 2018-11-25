module.exports = (docs, asyncFunction) => {
    return Promise.all(docs.map(doc => asyncFunction(doc)));
};

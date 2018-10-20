module.exports.default = (req, res, next) => {
    const browser = req.headers['user-agent'];
    const origin = req.headers['origin'];

    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Content-Disposition, authorization');

    if (/Trident/.test(browser)) {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    }

    if (req.method === 'OPTIONS') {
        return res.status(200).send({});
    }

    next();
};


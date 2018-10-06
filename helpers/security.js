const bcrypt = require('bcrypt');

// async function, check password
module.exports.compare = (password, hash) => {
    return bcrypt.compare(password, hash);
};

// async function, create hash for password
module.exports.hash = password => {
    return bcrypt.hash(password, 4);
};
const jwt = require('jsonwebtoken');

module.exports.checkToken = (token, key) => {
    return jwt.verify(token, key, (err,data) => {
        if(err ) throw null;
        return data;
    });
}
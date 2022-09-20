const {createHash} = require("crypto");
exports.toSHA256 = (plain) => {
    return createHash('sha256').update(plain).digest('hex');
}
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hash = function(string) {
    const hash = bcrypt.hashSync(string, saltRounds);
    return hash;
}

exports.compare = function (string ,hashString) {
    const result = bcrypt.compareSync(string, hashString);
    return result;
}
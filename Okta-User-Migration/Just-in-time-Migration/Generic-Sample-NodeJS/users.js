const fs = require('fs');

const users = JSON.parse(fs.readFileSync('./users.json'))

console.log(users)

function validate(username, password) {
    return users.some(user => user.username === username && user.password === password);
}

exports.validate = validate;
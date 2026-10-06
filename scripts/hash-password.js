const crypto = require('crypto');
const salt = crypto.randomBytes(16);
console.log(salt.toString('hex') + ':' + crypto.scryptSync(process.argv[2] || '', salt, 64).toString('hex'));

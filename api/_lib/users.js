const crypto = require('crypto');
// Passwords are stored as scrypt hashes ("salt:hash"), never in plain text.
// Generate a new one with:  node scripts/hash-password.js "your password"
const USERS = { student: '07b26a20f9815ff48868964c71d407ad:ca45bac1e070b88acab564e204af1e4c7076d09f0d89d3db1e93675e0ad0f24af7a247c7c43bb634cc0129e564a9f3b8c96fd16380fe67ac0e02a8d2bac9021a' };
const DUMMY = '00000000000000000000000000000000:' + '0'.repeat(128);

function checkPassword(username, password) {
  const stored = Object.prototype.hasOwnProperty.call(USERS, username) ? USERS[username] : DUMMY;
  const [salt, hash] = stored.split(':');
  const calc = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64);
  const ok = crypto.timingSafeEqual(calc, Buffer.from(hash, 'hex'));
  return ok && stored !== DUMMY;
}
module.exports = { checkPassword };

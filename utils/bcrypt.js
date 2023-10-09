const bcrypt = require('bcrypt');

const hash = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const compare = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hash,
  compare,
};
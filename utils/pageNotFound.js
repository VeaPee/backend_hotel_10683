const Response = require('../model/Response');

const pageNotFound = (_, res) => {
  res.json(new Response.Error(true, 'Page Not Found CI/CD'));
};

module.exports = pageNotFound;
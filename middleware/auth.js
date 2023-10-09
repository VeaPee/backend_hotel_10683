const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const Akun = require('@prisma/client').Akun;
const Response = require('../model/Response');
const clearToken = require('../utils/clearToken');
const tokenRevocation = require('../utils/tokenRevocation');

const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const response = new Response.Error(true, 'Unauthorized');
  
    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json(response);
      return;
    }
  
    const myToken = clearToken(token);
  
    if (await tokenRevocation.isTokenRevoked(token)) {
      res.status(httpStatus.UNAUTHORIZED).json(response);
      return;
    }
  
    jwt.verify(myToken, async (error, payload) => {
      if (error) {
        res.status(httpStatus.UNAUTHORIZED).json(response);
        return;
      }
      
      const { id } = payload;
      const akun = await Akun.findOne({ _id: id });
      req.currentUser = akun;
      next();
    });
  } catch (error) {
    const response = new Response.Error(true, 'Internal server error');
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
  }
}

module.exports = Auth;
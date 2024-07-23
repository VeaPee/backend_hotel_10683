const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const prisma = require('../prisma/client');
const Response = require('../model/Response');
const clearToken = require('../utils/clearToken');

const Auth = async (req, res, next) => {
  try {
    // await prisma.$connect();

    const token = req.headers.authorization;
    const response = new Response.Error(true, 'Unauthorized');

    if (!token || token === '') {
      const response = new Response.Error(true, 'Unauthorized');
      res.status(httpStatus.UNAUTHORIZED).json(response);
      return;
    }

    const myToken = clearToken(token);

    jwt.verify(myToken, 
      await process.env.KEY,
      // await callAccessSecretVersion(), 
      async (error, payload) => {
      if (error) {
        res.status(httpStatus.UNAUTHORIZED).json(response);
        return;
      }
      
      const {id} = payload;
      const account = await prisma.akun.findUnique({where:{id: id}  });
      req.currentUser = account;
      next();
    });
  } catch (error) {
    const response = new Response.Error(true, 'Internal server error');
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
  }
}

module.exports = Auth;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const prisma = require('../prisma/client');
const Response = require('../model/Response');
const clearToken = require('../utils/clearToken');
// const tokenRevocation = require('../utils/tokenRevocation');
// const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// const secretmanagerClient = new SecretManagerServiceClient();

// const callAccessSecretVersion = async () => {
//   // Construct request
//   const request = {
//     name: 'projects/999454011714/secrets/KEY/versions/latest'
//   };

//   // Run request
//   const [response] = await secretmanagerClient.accessSecretVersion(request);
//   const secretValue = response.payload.data.toString();
//   return secretValue;
// }

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

    // if (await tokenRevocation.isTokenRevoked(token)) {
    //   res.status(httpStatus.UNAUTHORIZED).json(response);
    //   return;
    // }

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

// async function checkRole(req, res, next) {
//   const accountId = req.currentUser.roleId;

//   if (accountId == 6) {
//     return res.status(403).json({
//       message: 'Forbidden',
//     });
//   }

//   next();
// }

module.exports = Auth;
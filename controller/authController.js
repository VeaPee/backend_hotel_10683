const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Response = require('../model/Response');
const { PrismaClient } = require('@prisma/client');
const akunValidator = require('../utils/akunValidator');
const loginValidator = require('../utils/loginValidator');
const bcrypt = require('../utils/bcrypt');

const register = async (req, res) => {
    // Initialize the `prisma` variable
    const prisma = new PrismaClient();
  
    try {
      // Establish the database connection
      await prisma.$connect();
  
      const request = await akunValidator.validateAsync(req.body);
  
      const accounts = await prisma.akun.findUnique({ where: { username: request.username } });
      if (accounts) {
        const response = new Response.Error(true, 'Username Sudah Ada');
        res.status(httpStatus.BAD_REQUEST).json(response);
        return;
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(request.password);
  
      // Remove the `username` field from the request object
      const { username, ...data } = request;
  
      // Create the account
      const account = await prisma.akun.create({
        data: {
          username,
          password: hashedPassword,
          Role: {
            connect: { id: 6 }, // Replace `1` with the appropriate Role ID
          },
          ...data,
        },
      });
  
      if (!account) {
        // Handle the error here
        console.error('Error creating account:', prisma.$error);
        const response = new Response.Error(true, 'Error creating account');
        res.status(httpStatus.BAD_REQUEST).json(response);
        return;
      }
  
      const response = new Response.Success(false, 'Akun berhasil dibuat', account);
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      // Handle the error here
      console.error(error);
      const response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
    } finally {
      // Disconnect from the database
      await prisma.$disconnect();
    }
  };


const login = async (req, res) => {
  const prisma = new PrismaClient();
  let response = null;
  const loginErrorMessage = 'Invalid username atau password';
  try {
    const request = await loginValidator.validateAsync(req.body);

    const account = await prisma.akun.findUnique({ where: { username: request.username } });
    if (!account) {
      response = new Response.Error(true, loginErrorMessage);
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const isValidPassword = bcrypt.compare(request.password, account.password);
    if (!isValidPassword) {
      response = new Response.Error(true, loginErrorMessage);
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const createJwtToken = jwt.sign({ id: account._id }, process.env.KEY);
    const data = {
      id: account._id,
      name: account.name,
      token: createJwtToken,
    };
    response = new Response.Success(false, 'success', data);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = { register, login };
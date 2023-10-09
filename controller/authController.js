const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Response = require('../model/Response');
const { PrismaClient } = require('@prisma/client');
const akunValidator = require('../utils/akunValidator');
const loginValidator = require('../utils/loginValidator');
const bcrypt = require('../utils/bcrypt');

const register = async (req, res) => {
    const prisma = new PrismaClient(); // Initialize the `prisma` variable
    let response = null;
  
    try {
      const request = await akunValidator.validateAsync(req.body);
  
      const accounts = await prisma.akun.findUnique({ where: { username: request.username } });
      if (accounts) {
        response = new Response.Error(true, 'Username Sudah Ada');
        res.status(httpStatus.BAD_REQUEST).json(response);
        return;
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(request.password);
  
      // Remove the `username` field from the request object
      delete request.username;
  
      // Set the `password` field to a `Prisma.Hash` object
      request.password = prisma.Hash.from(hashedPassword);
  
      // Check if the `prisma` variable is defined before trying to use it
      const account = prisma ? await prisma.akun.create({
        ...request,
      }) : undefined;
  
      response = new Response.Success(false, 'Akun berhasil dibuat', account);
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      // Handle the error here
      console.error(error);
      response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
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
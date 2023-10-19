const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const akunValidator = require("../utils/akunValidator");
const loginValidator = require("../utils/loginValidator");
const bcrypt = require("../utils/bcrypt");
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const secretmanagerClient = new SecretManagerServiceClient();

const callAccessSecretVersion = async () => {
  // Construct request
  const request = {
    name: 'projects/999454011714/secrets/KEY/versions/latest'
  };

  // Run request
  const [response] = await secretmanagerClient.accessSecretVersion(request);
  const secretValue = response.payload.data.toString();
  return secretValue;
}

const register = async (req, res) => {
  try {
    const request = await akunValidator.validateAsync(req.body);

    const accounts = await prisma.akun.findUnique({
      where: { username: request.username },
    });
    if (accounts) {
      const response = new Response.Error(true, "Username Sudah Ada");
      res.status(httpStatus.OK).json(response);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(request.password);

    // Remove the `username` field from the request object
    const { username } = request;

    // Create the account
    const account = await prisma.akun.create({
      data: {
        username: username,
        password: hashedPassword,
        Role: {
          connect: { id: 6 }, // Replace number with the appropriate Role ID
        },
      },
    });

    if (!account) {
      // Handle the error here
      console.error("Error creating account:", prisma.$error);
      const response = new Response.Error(true, "Error creating account");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const response = new Response.Success(
      false,
      "Akun berhasil dibuat",
      account
    );
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
  let response = null;
  const loginErrorMessage = "Invalid username atau password";
  try {
    const request = await loginValidator.validateAsync(req.body);

    const account = await prisma.akun.findUnique({
      where: { username: request.username },
    });
    if (!account) {
      response = new Response.Error(true, loginErrorMessage);
      res.status(httpStatus.OK).json(response);
      return;
    }

    const isValidPassword = await bcrypt.compare(
      request.password,
      account.password
    );
    if (!isValidPassword) {
      response = new Response.Error(true, loginErrorMessage);
      res.status(httpStatus.OK).json(response);
      return;
    }

    const createJwtToken = jwt.sign(
      {
        id: account.id,
        roleId: account.roleId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // expires in 24 hours
      },
      // process.env.KEY
      await callAccessSecretVersion()
    );

    const data = {
      id: account.id,
      username: account.username,
      password: account.password,
      token: createJwtToken,
    };
    response = new Response.Success(false, "success", data);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = { register, login };

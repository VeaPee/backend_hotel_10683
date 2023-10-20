const { PrismaClient } = require("@prisma/client");

const mysql = require('mysql2/promise');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const secretmanagerClient = new SecretManagerServiceClient();

const callAccessSecretVersion = async () => {
  // Construct request
  const request = {
    name: 'projects/999454011714/secrets/MYSQL/versions/latest'
  };

  // Run request
  const [response] = await secretmanagerClient.accessSecretVersion(request);
  const secretValue = response.payload.data.toString();
  return secretValue;
};

const parseConnectionString = (connectionString) => {
  const regex = /mysql:\/\/(.*?):(.*?)@(.*?):(.*?)\/(.*)/;
  const [, user, password, host, port, database] = connectionString.match(regex);
  return { user, password, host, port, database };
};

const connectToDatabase = async () => {
  try {
    const secretValue = await callAccessSecretVersion();
    const { user, password, host, port, database } = parseConnectionString(secretValue);
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database
    });
    console.log('Database Connected');
    // Close the connection when finished
    connection.end();

    return new PrismaClient(); // Return the Prisma client instance
  } catch (error) {
    console.log(error.message);
    throw error; // Throw the error to prevent Prisma from starting with an invalid client
  }
};

module.exports = connectToDatabase;
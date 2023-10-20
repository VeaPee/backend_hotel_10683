const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const secretmanagerClient = new SecretManagerServiceClient();

const callAccessSecretVersionMySQL = async () => {
  // Construct request
  const request = {
    name: 'projects/999454011714/secrets/MYSQL/versions/latest',
  };

  // Run request
  const [response] = await secretmanagerClient.accessSecretVersion(request);
  const secretValue = response.payload.data.toString();

  // Set secretValue in the environment
  process.env.SECRET_VALUE = secretValue;

  return secretValue;
};

module.exports = callAccessSecretVersionMySQL;
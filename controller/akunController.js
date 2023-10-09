const httpStatus = require("http-status");
const Response = require("../model/Response");
const { PrismaClient } = require("@prisma/client");
const AkunPassValidator = require("../utils/akunPassValidator");
const bcrypt = require("../utils/bcrypt");

const getAkun = async (req, res) => {
    // Get the current user from the request
  const currentUser = req.user;

  // Get the user's account from Prisma
  const akun = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
  });

  // Send the user's account to the client
  res.json(akun);
};

const updatePassword = async (req, res) => {
    const prisma = new PrismaClient();
    let response = null;
  
    try {
      // Get the current user's ID and password
      const akunId = req.currentUser._id;
      const akunPassword = await prisma.akun.findUnique({
        where: {
          id: akunId,
        },
      }).password;
  
      // Validate the request body
      const request = await AkunPassValidator.validateAsync(req.body);
      const bodyAkunPassword = request.oldPassword;
  
      // Verify that the old password is correct
      const isValidPassword = await bcrypt.compare(bodyAkunPassword, akunPassword);
      if (!isValidPassword) {
        response = new Response.Error(true, "Password lama tidak sesuai");
        res.status(httpStatus.BAD_REQUEST).json(response);
        return;
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(request.newPassword);
  
      // Update the user's password in the database
      await prisma.akun.update({
        where: {
          id: akunId,
        },
        data: {
          password: hashedPassword,
        },
      });
  
      // Send a success response
      response = new Response.Success(false, "Password berhasil diubah");
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      // Send an error response
      response = new Response.Error(true, error.message);
      res.status(httpStatus.BAD_REQUEST).json(response);
    } finally {
      // Close the Prisma client connection
      prisma.$disconnect();
    }
  };

module.exports = { getAkun, updatePassword };

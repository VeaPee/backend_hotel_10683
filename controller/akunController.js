const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const AkunPassValidator = require("../utils/akunPassValidator");
const bcrypt = require("../utils/bcrypt");


// Get the user's account from Prisma
const getAkun = async (req, res) => {
  try {

    const account = req.currentUser;

    if (!account) {
      const response = new Response.Error(true, 'Account not found');
      return res.status(httpStatus.NOT_FOUND).json(response);
    }
    
    const response = new Response.Success(false, 'success', { account });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updatePassword = async (req, res) => {
  let response = null;

  try {
    const accountId = req.currentUser.id;
    const accountPassword = req.currentUser.password;
    const request = await AkunPassValidator.validateAsync(req.body);
    const bodyAccountPassword = request.oldPassword;
    const isValidPassword = await bcrypt.compare(bodyAccountPassword, accountPassword);

    if (!isValidPassword) {
      throw new Error('Password lama tidak sesuai');
    }

    const hashedPassword = await bcrypt.hash(request.newPassword);

    await prisma.akun.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    });

    response = new Response.Success(false, 'Password berhasil diubah');
    return res.status(httpStatus.OK).json(response);
  } catch (error) {
    if (error instanceof Error) {
      response = new Response.Error(true, error.message);
      return res.status(httpStatus.BAD_REQUEST).json(response);
    } else {
      response = new Response.Error(true, error.message);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
    }
  }
};

module.exports = { getAkun, updatePassword };

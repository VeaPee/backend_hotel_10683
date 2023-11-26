const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");

const getAllCustomer = async (req, res) => {
  let response = null;
  const getMessage = "Data Customer berhasil diterima";

  try {
    const customer = await prisma.Customer.findMany({
      select: {
        id: true,
        jenis_customer: true,
        nama_customer: true,
        nama_institusi: true,
        nomor_identitas: true,
        nomor_telepon: true,
        email: true,
        alamat: true,
        // Include the related 'Akun' data
        Akun: {
          select: {
            id: true,
            roleId: true,
            username: true,
            password: true,
            createdAt: true,
            // Include the related 'Role' data if needed
          },
        },
      },
    });

    if (customer.length === 0) {
      const response = new Response.Error(
        true,
        "error",
        "Data Customer Kosong"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(true, "success", getMessage, customer);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getTopCustomer = async (req, res) => {
  let response = null;
  const getMessage = "Data Customer berhasil diterima";

  try {
    const customer = await prisma.notaPelunasan.findMany({
      where: { no_invoice: { not: "TEMPORARY" } },
      select: {
        id: true,
        subtotal: true,

        Reservasi: {
          select: {
            Customer: {
              select: {
                nama_customer: true
              }
            }
          }
        }
      },
    });

    if (customer.length === 0) {
      const response = new Response.Error(
        true,
        "error",
        "Data Customer Kosong"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(true, "success", getMessage, customer);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getAllCustomer,
  getTopCustomer
};

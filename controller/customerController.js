const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const customerValidator = require("../utils/customerValidator");

const getCustomer = async (req, res) => {
  let response = null;
  const getCustomerMessage = "Data Customer berhasil diterima";

  try {
    const accountId = req.currentUser.id;

    if (accountId === null) {
      response = new Response.Error(true, "error", "accountId is required");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const customer = await prisma.customer.findMany({
      where: {
        akunId: parseInt(accountId),
      },
    });

    if (customer.length === 0) {
      const response = new Response.Error(true, "error", "Data Kosong");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(
      false,
      "success",
      getCustomerMessage,
      customer
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getCustomerByID = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!customer) {
      const response = new Response.Error(
        true,
        "error",
        "Data Customer Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", {
      customer,
    });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

//Nyelip, Malas buat baru
const getPegawaiByID = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const pegawai = await prisma.pegawai.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!pegawai) {
      const response = new Response.Error(
        true,
        "error",
        "Data Pegawai Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", {
      pegawai,
    });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addCustomer = async (req, res) => {
  let response = null;
  try {
    const accountId = req.currentUser.id;
    const accountRole = req.currentUser.roleId;

    //Check Customer
    const customerCheck = await prisma.customer.findFirst({
      where: {
        akunId: parseInt(accountId),
      },
    });

    if (accountRole === 6) {
      if (customerCheck) {
        const response = new Response.Error(
          true,
          "error",
          "Data Customer hanya boleh 1"
        );
        res.status(httpStatus.BAD_REQUEST).json(response);
        return;
      }
      req.body.jenis_customer = "Personal";
    } else if (accountRole === 2) {
      req.body.jenis_customer = "Grup";
    } else {
      const response = new Response.Error(
        true,
        "error",
        "Tidak diperbolehkan menambah Data"
      );
      res.status(httpStatus.OK).json(response);
      return;
    }

    //Body Request
    req.body.akunId = parseInt(accountId);

    const addCustomer = await customerValidator.validateAsync(req.body);

    if (!accountId) {
      response = new Response.Error(true, "error", "accountId is required");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const customer = await prisma.customer.create({
      data: addCustomer,
    });

    response = new Response.Success(
      false,
      "success",
      "Customer berhasil dibuat",
      customer
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateCustomer = async (req, res) => {
  let response = null;

  try {
    const accountId = req.currentUser.id;
    const accountRole = req.currentUser.roleId;
    const id = req.params.id;

    if (accountRole === 6) {
      req.body.jenis_customer = "Personal";
    } else if (accountRole === 2) {
      req.body.jenis_customer = "Grup";
    }

    req.body.akunId = parseInt(accountId);
    const updatedCustomer = await customerValidator.validateAsync(req.body);

    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!customer) {
      const response = new Response.Error(
        true,
        "error",
        "Data Customer Tidak Ada"
      );
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    //Checking Account
    if (accountId != customer.akunId) {
      const response = new Response.Error(
        true,
        "error",
        "Tidak bisa update data"
      );
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const updated = await prisma.customer.update({
      where: {
        id: parseInt(id),
      },

      data: updatedCustomer,
    });

    response = new Response.Success(
      false,
      "success",
      "Customer berhasil diperbarui",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

//Riwayat Reservasi

const getRiwayatTransaksi = async (req, res) => {
  let response = null;
  const getRiwayatMessage = "Data Riwayat berhasil diterima";

  try {
    const accountId = req.currentUser.id;
    const accountRole = req.currentUser.roleId;

    const { status, nama_customer, prefix_reservasi, check_in, month } =
      req.query;

    let whereClause = {}; // Declare whereClause here

    if (accountRole === 2) {
      const pegawai = await prisma.pegawai.findFirst({
        where: {
          akunId: parseInt(accountId),
        },
      });

      if (!pegawai) {
        const response = new Response.Error(
          true,
          "error",
          "Data Pegawai Tidak Ada"
        );
        res.status(httpStatus.OK).json(response);
        return;
      }

      const pegawaiId = pegawai.id;

      whereClause = {
        pegawaiId: pegawaiId,
      };
    } else if (accountRole === 6) {
      const customer = await prisma.customer.findFirst({
        where: {
          akunId: parseInt(accountId),
        },
      });

      if (!customer) {
        const response = new Response.Error(
          true,
          "error",
          "Data Customer Tidak Ada"
        );
        res.status(httpStatus.OK).json(response);
        return;
      }

      const customerId = customer.id;

      whereClause = {
        customerId: customerId,
      };
    } else if (accountRole === 3) {
      const fo = await prisma.pegawai.findFirst({
        where: {
          akunId: parseInt(accountId),
        },
      });

      if (!fo) {
        const response = new Response.Error(true, "error", "Data FO Tidak Ada");
        res.status(httpStatus.OK).json(response);
        return;
      }

      whereClause = {
        check_in: {
          equals: check_in ? new Date(`${check_in}T00:00:00.000Z`) : undefined,
        },
      };
    } else if (accountRole === 4 || accountRole === 5) {
      const ownerGM = await prisma.pegawai.findFirst({
        where: {
          akunId: parseInt(accountId),
        },
      });

      if (!ownerGM) {
        const response = new Response.Error(
          true,
          "error",
          "Data Owner / GM Tidak Ada"
        );
        res.status(httpStatus.OK).json(response);
        return;
      }

      const monthTemp = (parseInt(month) % 12) + 1;
      const nextYear = parseInt(month) === 12 ? 2024 : 2023;
      
      const startDate = new Date(`2023-${month}-01T00:00:00.000Z`);
      const endDate = new Date(`${nextYear}-${monthTemp.toString().padStart(2, '0')}-01T00:00:00.000Z`);
      
      whereClause = {
        tanggal_reservasi: month
          ? {
              gte: startDate,
              lt: endDate,
            }
          : undefined,
      };
      
      
      
      
      console.log("Bulan Awal",month)
      console.log("Bulan Akhir",monthTemp)
    }

    if (status) {
      // Check if the status is "Bisa Dibatalkan"
      if (status === "Bisa Dibatalkan") {
        whereClause.status = {
          in: ["Belum Dibayar", "Sudah Dibayar"],
        };
      } else {
        whereClause.status = status;
      }
    }

    if (nama_customer) {
      whereClause.Customer = {
        nama_customer: {
          contains: nama_customer,
        },
      };
    }

    if (prefix_reservasi) {
      whereClause.prefix_reservasi = {
        contains: prefix_reservasi,
      };
    }

    const riwayatTransaksi = await prisma.reservasi.findMany({
      where: whereClause,
      include: {
        NotaPelunasan: true,
        DetailReservasiKamar: {
          include: {
            Kamar: true,
          },
        },
        DetailReservasiFasilitas: true,
        Customer: true,
        Pegawai: true,
      },
    });

    response = new Response.Success(
      false,
      "success",
      getRiwayatMessage,
      riwayatTransaksi
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getDetailRiwayatTransaksi = async (req, res) => {
  let response = null;
  const getRiwayatMessage = "Data Riwayat berhasil diterima";

  try {
    const idReservasi = req.params.id;

    const detailRiwayatTransaksi = await prisma.reservasi.findFirst({
      where: {
        id: parseInt(idReservasi),
      },
      include: {
        NotaPelunasan: true,
        Customer: true,
        Pegawai: true,
        DetailReservasiKamar: {
          include: {
            Kamar: {
              include: {
                Tarif: {
                  include: {
                    Season: true,
                  },
                },
              },
            },
          },
        },
        DetailReservasiFasilitas: {
          include: {
            FasilitasTambahan: true,
          },
        },
      },
    });

    if (!detailRiwayatTransaksi) {
      const response = new Response.Error(
        true,
        "error",
        "Data Riwayat Transaksi Tidak Ada"
      );
      res.status(httpStatus.OK).json(response);
      return;
    }

    response = new Response.Success(
      false,
      "success",
      getRiwayatMessage,
      detailRiwayatTransaksi
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getCustomer,
  getCustomerByID,
  getPegawaiByID,
  addCustomer,
  updateCustomer,
  getRiwayatTransaksi,
  getDetailRiwayatTransaksi,
};

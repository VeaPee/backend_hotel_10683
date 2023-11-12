const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const transaksiValidator = require("../utils/transaksiValidator");
const detailReservasiKamarValidator = require("../utils/detailReservasiKamarValidator");
const detailReservasiFasilitasValidator = require("../utils/detailReservasiFasilitasValidator");
const pembayaranValidator = require("../utils/pembayaranValidator");

const transaksiReservasi = async (req, res) => {
  let response = null;
  const getMessage = "Data Reservasi Berhasil Dikirim";

  try {
    const accountId = req.currentUser.id;
    let accountRole = parseInt(req.currentUser.roleId);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).substring(2);
    const newDate = day + month + year;

    if (accountId === null) {
      response = new Response.Error(true, "error", "accountId is required");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    let prefixReservasi = '';
    let prefixExists = true;
    let counter = 1;

    while (prefixExists) {
      const paddedCounter = String(counter).padStart(3, '0');
      prefixReservasi = (accountRole === 2 ? 'G' : 'P') + newDate + '-' + paddedCounter;
      
      const existingReservasi = await prisma.reservasi.findFirst({
        where: {
          prefix_reservasi: prefixReservasi,
        },
      });

      if (!existingReservasi) {
        prefixExists = false;
      } else {
        counter++;
      }
    }

    if (accountRole == 2) {
      const customerId = req.body.customerId;
      const pegawaiCheck = await prisma.pegawai.findFirst({
        where: {
          akunId: parseInt(accountId),
        },
      });

      req.body.customerId = customerId;
      req.body.pegawaiId = pegawaiCheck.id;
    } else if (accountRole == 6) {
      const customerCheck = await prisma.customer.findFirst({
        where: {
          akunId: parseInt(accountId),
        },
      });

      req.body.customerId = customerCheck.id;
      req.body.pegawaiId = 10;
    }

    req.body.prefix_reservasi = prefixReservasi;
    req.body.status = "Belum Dibayar";
    req.body.tanggal_reservasi = currentDate;

    const addTransaksi = await transaksiValidator.validateAsync(req.body);

    const reservasi = await prisma.reservasi.create({
      data: addTransaksi,
    });

    response = new Response.Success(false, "success", getMessage, reservasi);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};


const transaksiKamar = async (req, res) => {
  let response = null;
  try {
    const addKamar = await detailReservasiKamarValidator.validateAsync(
      req.body
    );
    const kamar = await prisma.detailReservasiKamar.create({
      data: addKamar,
    });

    const response = new Response.Success(
      false,
      "success",
      "Kamar berhasil dipesan",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error(error);
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const transaksiFasilitas = async (req, res) => {
  let response = null;
  try {
    const addFasilitas = await detailReservasiFasilitasValidator.validateAsync(
      req.body
    );
    const fasilitas = await prisma.detailReservasiFasilitas.create({
      data: addFasilitas,
    });

    const response = new Response.Success(
      false,
      "success",
      "Fasilitas berhasil dibuat",
      fasilitas
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error(error);
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const konfirmasiPembayaran = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const pembayaran = await pembayaranValidator.jaminanValidator.validateAsync(
      req.body
    );

    const status = await prisma.reservasi.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!status) {
      const response = new Response.Error(
        true,
        "error",
        "Data Reservasi Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const idReservasi = status.id;

    const jaminan = await prisma.notaPelunasan.findUnique({
      where: {
        reservasiId: parseInt(idReservasi),
      },
    });

    if (!jaminan) {
      const response = new Response.Error(
        true,
        "error",
        "Data Reservasi Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const idNota = jaminan.id;

    const updated = await prisma.notaPelunasan.update({
      where: {
        id: parseInt(idNota),
      },

      data: pembayaran,
    });

    const statusValid = "Sudah Dibayar";

    const updatedStatus = await prisma.reservasi.update({
      where: {
        id: parseInt(id),
      },

      data: statusValid,
    });

    const response = new Response.Success(
      false,
      "success",
      "Jaminan berhasil ditambahkan",
      updated
    );

    const responseStatus = new Response.Success(
      false,
      "success",
      "Status berhasil diperbarui",
      updatedStatus
    );

    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const pembatalanReservasi = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const reservasi = await prisma.reservasi.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        detailReservasiFasilitas: true,
        detailReservasiKamar: true,
      },
    });

    if (!reservasi) {
      const response = new Response.Error(
        true,
        "error",
        "Data Reservasi Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    if (
      reservasi.status === "Sudah Check In" ||
      reservasi.status === "Selesai"
    ) {
      const response = new Response.Error(
        true,
        "error",
        "Reservasi tidak dapat dibatalkan karena sudah berlangsung"
      );
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const deleted = await prisma.reservasi.delete({
      where: {
        id: parseInt(id),
      },
      include: {
        detailReservasiFasilitas: true,
        detailReservasiKamar: true,
      },
    });

    // Delete related records from detailReservasiFasilitas table
    for (const detailFasilitas of deleted.detailReservasiFasilitas) {
      await prisma.detailReservasiFasilitas.delete({
        where: {
          id: detailFasilitas.id,
        },
      });
    }

    // Delete related records from detailReservasiKamar table
    for (const detailKamar of deleted.detailReservasiKamar) {
      await prisma.detailReservasiKamar.delete({
        where: {
          id: detailKamar.id,
        },
      });
    }

    const response = new Response.Success(
      false,
      "success",
      "Reservasi berhasil dibatalkan",
      deleted
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  transaksiReservasi,
  transaksiKamar,
  transaksiFasilitas,
  konfirmasiPembayaran,
  pembatalanReservasi,
};

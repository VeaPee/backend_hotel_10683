const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const transaksiValidator = require("../utils/transaksiValidator");
const detailReservasiKamarValidator = require("../utils/detailReservasiKamarValidator");
const detailReservasiFasilitasValidator = require("../utils/detailReservasiFasilitasValidator");
const pembayaranValidator = require("../utils/pembayaranValidator");
const statusPembayaranValidator = require("../utils/statusPembayaranValidator");
const tambahFasilitasNotaValidator = require("../utils/tambahFasilitasNotaValidator");

const transaksiReservasi = async (req, res) => {
  let response = null;
  const getMessage = "Data Reservasi Berhasil Dikirim";

  try {
    const accountId = req.currentUser.id;
    let accountRole = parseInt(req.currentUser.roleId);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).substring(2);
    const newDate = day + month + year;

    if (accountId === null) {
      response = new Response.Error(true, "error", "accountId is required");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    let prefixReservasi = "";
    let prefixExists = true;
    let counter = 1;

    while (prefixExists) {
      const paddedCounter = String(counter).padStart(3, "0");
      prefixReservasi =
        (accountRole === 2 ? "G" : "P") + newDate + "-" + paddedCounter;

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

      console.log(customerId);
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

const konfirmasiResume = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

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

    req.body.reservasiId = id;
    req.body.no_invoice = "TEMPORARY";

    const nota = await pembayaranValidator.validateAsync(req.body);

    const notaSementara = await prisma.notaPelunasan.create({
      data: nota,
    });

    const response = new Response.Success(
      false,
      "success",
      "Harap Melanjutkan ke Pembayaran",
      notaSementara
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
  }
};

const konfirmasiPembayaran = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    // const updatedStatus = await statusPembayaranValidator.validateAsync(req.body);

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

    const updated = await prisma.reservasi.update({
      where: {
        id: parseInt(id),
      },

      data: {
        status: "Sudah Dibayar",
      },
    });

    const response = new Response.Success(
      false,
      "success",
      "Pembayaran Dikonfirmasi",
      updated
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
      reservasi.status === "Selesai" ||
      reservasi.status === "Dibatalkan"
    ) {
      const response = new Response.Error(
        true,
        "error",
        "Reservasi tidak dapat dibatalkan"
      );
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const tanggalCheckIn = new Date(reservasi.check_in);
    const tanggalReservasi = new Date(reservasi.tanggal_reservasi);
    const dayDiff = Math.ceil(
      (tanggalCheckIn - tanggalReservasi) / (1000 * 60 * 60 * 24)
    );

    let updateMessage = "";
    if (dayDiff > 7) {
      updateMessage = "Uang Anda Dikembalikan";
    } else {
      updateMessage = "Uang Anda Tidak Dapat Dikembalikan";
    }

    const updated = await prisma.reservasi.update({
      where: {
        id: parseInt(id),
      },

      data: {
        status: "Dibatalkan",
      },
    });

    const response = new Response.Success(
      false,
      "success",
      `Reservasi Dibatalkan - ${updateMessage}`,
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const checkIn = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    // const updatedStatus = await statusPembayaranValidator.validateAsync(req.body);

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

    const updated = await prisma.reservasi.update({
      where: {
        id: parseInt(id),
      },

      data: {
        status: "Sudah Check In",
      },
    });

    const response = new Response.Success(
      false,
      "success",
      "Check In Berhasil",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const checkOut = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const accountId = req.currentUser.id;
    let accountRole = parseInt(req.currentUser.roleId);
    // const updatedStatus = await statusPembayaranValidator.validateAsync(req.body);

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

    // Buat NO INVOICE

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = String(currentDate.getFullYear()).substring(2);
    const newDate = day + month + year;

    let no_invoice = "";
    let prefixExists = true;
    let counter = 1;

    while (prefixExists) {
      const paddedCounter = String(counter).padStart(3, "0");
      no_invoice =
        (status.prefix_reservasi.charAt(0) === "G" ? "G" : "P") +
        newDate +
        "-" +
        paddedCounter;

      const existingReservasi = await prisma.notaPelunasan.findFirst({
        where: {
          no_invoice: no_invoice,
        },
      });

      if (!existingReservasi) {
        prefixExists = false;
      } else {
        counter++;
      }
    }

    const statusNota = await prisma.notaPelunasan.findFirst({
      where: {
        reservasiId: parseInt(id),
      },
    });

    if(status.prefix_reservasi.charAt(0) === "G"){
      const updatedNotaPelunasan = await prisma.notaPelunasan.update({
        where: {
          id: parseInt(statusNota.id),
        },
        data: {
          no_invoice: no_invoice,
          subtotal: statusNota.subtotal + (statusNota.jaminan * 0.5)
        },
      });
      console.log("Updated Nota Pelunasan:", updatedNotaPelunasan);
    }else{
      const updatedNotaPelunasan = await prisma.notaPelunasan.update({
        where: {
          id: parseInt(statusNota.id),
        },
        data: {
          no_invoice: no_invoice,
        },
      });
      console.log("Updated Nota Pelunasan:", updatedNotaPelunasan);
    }

    //Cek Pegawai

    const pegawaiFO = await prisma.pegawai.findFirst({
      where: {
        akunId: parseInt(accountId),
      },
    });

    if (!pegawaiFO) {
      const response = new Response.Error(
        true,
        "error",
        "Data Pegawai Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const updated = await prisma.reservasi.update({
      where: {
        id: parseInt(id),
      },

      data: {
        pegawaiId: pegawaiFO.id,
        status: "Sudah Check Out",
      },
    });
    
    const response = new Response.Success(
      false,
      "success",
      "Check Out Berhasil",
      updated
    );

    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const tambahFasilitasNota = async (req, res) => {
  let response = null;

  try {
    const updatedNota = await tambahFasilitasNotaValidator.validateAsync(
      req.body
    );

    const status = await prisma.notaPelunasan.findFirst({
      where: {
        reservasiId: parseInt(updatedNota.reservasiId),
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

    const updated = await prisma.notaPelunasan.update({
      where: {
        id: parseInt(status.id),
      },

      data: updatedNota,
    });

    const response = new Response.Success(
      false,
      "success",
      "Penambahan Berhasil",
      updated
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
  konfirmasiResume,
  konfirmasiPembayaran,
  pembatalanReservasi,
  checkIn,
  checkOut,
  tambahFasilitasNota,
};

const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const kamarValidator = require("../utils/kamarValidator");
const availabilityValidator = require("../utils/availabilityValidator");
const detailKamarValidator = require("../utils/detailKamarValidator");

const getAllKamar = async (req, res) => {
  let response = null;
  const getKamarMessage = "Data Kamar berhasil diterima";

  try {
    const kamar = await prisma.kamar.findMany({
      include: {
        DetailKamar: true,
        Tarif: {
          include: {
            Season: true,
          },
        },
      },
    });

    if (kamar.length === 0) {
      const response = new Response.Error(true, "error", "Data Kamar Kosong");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(true, "success", getKamarMessage, kamar);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getAllNomorKamar = async (req, res) => {
  let response = null;
  const getKamarMessage = "Data Kamar berhasil diterima";

  try {
    const kamar = await prisma.detailKamar.findMany({
      include: {
        Kamar: true,
      },
    });

    if (kamar.length === 0) {
      const response = new Response.Error(true, "error", "Data Kamar Kosong");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(true, "success", getKamarMessage, kamar);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getKamarByID = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const kamar = await prisma.kamar.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        DetailKamar: true,
        Tarif: {
          include: {
            Season: true,
          },
        },
      },
    });

    if (!kamar) {
      const response = new Response.Error(
        true,
        "error",
        "Data Kamar Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", {
      kamar,
    });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getNomorKamarByID = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const kamar = await prisma.detailKamar.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Kamar: true,
      },
    });

    if (!kamar) {
      const response = new Response.Error(
        true,
        "error",
        "Data Kamar Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", {
      kamar,
    });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getKamarByJenis = async (req, res) => {
  let response = null;

  try {
    const jenisKamar = req.params.jenisKamar;

    const kamar = await prisma.kamar.findMany({
      where: {
        jenisKamar: jenisKamar,
      },
      include: {
        DetailKamar: true,
        Tarif: {
          include: {
            Season: true,
          },
        },
      },
    });

    if (kamar.length === 0) {
      return res.status(200).json({
        status: "success",
        message: `Tidak ada data kamar dengan jenis ${jenisKamar}`,
      });
    }

    const response = new Response.Success(false, "success", "success", {
      kamar,
    });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addKamar = async (req, res) => {
  let response = null;
  try {
    const addKamar = await kamarValidator.validateAsync(req.body);

    const kamar = await prisma.kamar.create({
      data: addKamar,
    });

    const response = new Response.Success(
      false,
      "success",
      "Kamar berhasil dibuat",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error(error);
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addNomorKamar = async (req, res) => {
  let response = null;
  try {
    const addKamar = await detailKamarValidator.validateAsync(req.body);

    const findKamar = await prisma.detailKamar.findFirst({
      where: {
        nomor_kamar: parseInt(addKamar.nomor_kamar),
      },
    });

    if (findKamar) {
      return res.status(400).json({
        status: "error",
        message: `Kamar dengan nomor ${addKamar.nomor_kamar} sudah ada`,
      });
    }

    const kamar = await prisma.DetailKamar.create({
      data: addKamar,
    });

    const response = new Response.Success(
      false,
      "success",
      "Nomor Kamar berhasil dibuat",
      kamar
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error(error);
    const response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateKamar = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const updatedKamar = await kamarValidator.validateAsync(req.body);

    const kamar = await prisma.kamar.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!kamar) {
      const response = new Response.Error(
        true,
        "error",
        "Data Kamar Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const updated = await prisma.kamar.update({
      where: {
        id: parseInt(id),
      },

      data: updatedKamar,
    });

    const response = new Response.Success(
      false,
      "success",
      "Kamar berhasil diperbarui",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateNomorKamar = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const updatedKamar = await detailKamarValidator.validateAsync(req.body);

    const findKamar = await prisma.detailKamar.findFirst({
      where: {
        nomor_kamar: parseInt(updatedKamar.nomor_kamar),
      },
    });

    if (findKamar) {
      return res.status(400).json({
        status: "error",
        message: `Kamar dengan nomor ${updatedKamar.nomor_kamar} sudah ada`,
      });
    }

    const kamar = await prisma.detailKamar.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!kamar) {
      const response = new Response.Error(
        true,
        "error",
        "Data Kamar Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const updated = await prisma.detailKamar.update({
      where: {
        id: parseInt(id),
      },

      data: updatedKamar,
    });

    const response = new Response.Success(
      false,
      "success",
      "Kamar berhasil diperbarui",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteKamar = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const kamar = await prisma.kamar.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!kamar) {
      const response = new Response.Error(
        true,
        "error",
        "Data Kamar Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    await prisma.$transaction([
      prisma.kamar.delete({
        where: {
          id: parseInt(id),
        },
      }),
      prisma.DetailKamar.deleteMany({
        where: {
          kamarId: parseInt(id),
        },
      }),
    ]);

    const response = new Response.Success(
      false,
      "success",
      "Kamar dan DetailKamar berhasil dihapus"
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteNomorKamar = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const kamar = await prisma.detailKamar.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!kamar) {
      const response = new Response.Error(
        true,
        "error",
        "Data Kamar Tidak Ada"
      );
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const deleted = await prisma.detailKamar.delete({
      where: {
        id: parseInt(id),
      },
    });

    const response = new Response.Success(
      false,
      "success",
      "Kamar berhasil dihapus",
      deleted
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const checkKamarAvailability = async (req, res) => {
  let response = null;

  try {
    await availabilityValidator.validateAsync(req.body);

    const tanggalAwal = new Date(req.body.tanggalAwal).toISOString();
    const tanggalAkhir = new Date(req.body.tanggalAkhir).toISOString();

    const kamarReserved = await prisma.DetailReservasiKamar.findMany({
      where: {
        AND: [
          {
            Reservasi: {
              status: "Sudah Dibayar",
              // (check_in <= tanggalAwal && tanggalAwal < check_out)
              OR: [
                {
                  check_in: { lte: tanggalAwal },
                  check_out: { gte: tanggalAwal },
                },
                // (check_in < tanggalAkhir && dto.tanggalAkhir <= check_out)
                {
                  check_in: { lte: tanggalAkhir },
                  check_out: { gte: tanggalAkhir },
                },
                // (tanggalAwal <= check_in && tanggalAkhir >= check_out)
                {
                  check_in: { gte: tanggalAwal },
                  check_out: { lte: tanggalAkhir },
                },
              ],
            },
          },
        ],
      },
      select: {
        kamarId: true,
      },
    });

    const kamarReservedIds = kamarReserved.map((kamar) => kamar.kamarId);

    const kamarAvailable = await prisma.Kamar.findMany({
      where: {
        NOT: {
          id: {
            in: kamarReservedIds,
          },
        },
      },
      include: {
        Tarif: {
          include: {
            Season: true,
          },
        },
      },
    });

    if (kamarAvailable.length === 0) {
      return res.status(404).json({
        status: "success",
        message: `Tidak ada data kamar tersedia`,
      });
    }

    const response = new Response.Success(false, "success", "success", {
      kamar: kamarAvailable,
    });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getAllKamar,
  getKamarByID,
  getKamarByJenis,
  addKamar,
  updateKamar,
  deleteKamar,
  checkKamarAvailability,
  getAllNomorKamar,
  getNomorKamarByID,
  addNomorKamar,
  updateNomorKamar,
  deleteNomorKamar,
};

const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const kamarValidator = require("../utils/kamarValidator");

const getAllKamar = async (req, res) => {
  let response = null;
  const getKamarMessage = "Data Kamar berhasil diterima";

  try {
    const kamar = await prisma.kamar.findMany();

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
    });

    if (!kamar) {
      const response = new Response.Error(true, "error", "Data Kamar Tidak Ada");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", { kamar });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error",error.message);
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
    });

    if (kamar.length === 0) {
      return res.status(200).json({
        status: "success",
        message: `Tidak ada data kamar dengan jenis ${jenisKamar}`,
      });
    }

    const response = new Response.Success(false, "success", "success", { kamar });
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
    const response = new Response.Error(true, "error",error.message);
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
      const response = new Response.Error(true, "error", "Data Kamar Tidak Ada");
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
    response = new Response.Error(true,"error", error.message);
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
      const response = new Response.Error(true,"error", "Data Kamar Tidak Ada");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const deleted = await prisma.kamar.delete({
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
    response = new Response.Error(true, "error",error.message);
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
};

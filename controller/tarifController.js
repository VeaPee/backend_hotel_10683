const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const tarifValidator = require("../utils/tarifValidator");

const getAllTarif = async (req, res) => {
  let response = null;
  const getTarifMessage = "Data Tarif berhasil diterima";

  try {
    const tarif = await prisma.tarif.findMany();

    if (!tarif) {
      const response = new Response.Error(true, "Data Tarif Kosong");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    response = new Response.Success(true, getTarifMessage, tarif);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getTarifByHarga = async (req, res) => {
  let response = null;

  try {
    const { min, max } = req.params;

    if (!min || !max) {
      const response = new Response.Error(true, "Data Tidak Boleh Kosong");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const tarif = await prisma.tarif.findMany({
      where: {
        harga: {
          gte: parseFloat(min),
          lte: parseFloat(max),
        },
      },
    });

    if (!tarif) {
      return res.status(200).json({
        status: "success",
        message: `Tidak ada data Tarif dengan range harga ${min} - ${max}`,
      });
    }

    const response = new Response.Success(false, "success", { tarif });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addTarif = async (req, res) => {
  let response = null;
  try {
    const addTarif = await tarifValidator.validateAsync(req.body);

    const tarif = await prisma.tarif.create({
      data: addTarif,
    });

    const response = new Response.Success(
      false,
      "Tarif berhasil dibuat",
      tarif
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateTarif = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const updatedTarif = await tarifValidator.validateAsync(req.body);

    const tarif = await prisma.tarif.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!tarif) {
      const response = new Response.Error(true, "Data Tarif Tidak Ada");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const updated = await prisma.tarif.update({
      where: {
        id: parseInt(id),
      },

      data: updatedTarif,
    });

    const response = new Response.Success(
      false,
      "Tarif berhasil diperbarui",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteTarif = async (req, res) => {
  const id = req.params.id;
  let response = null;

  try {
    const tarif = await prisma.tarif.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!tarif) {
      const response = new Response.Error(true, "Data Tarif Tidak Ada");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const deleted = await prisma.tarif.delete({
      where: {
        id: parseInt(id),
      },
    });

    const response = new Response.Success(
      false,
      "Tarif berhasil dihapus",
      deleted
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getAllTarif,
  getTarifByHarga,
  addTarif,
  updateTarif,
  deleteTarif,
};

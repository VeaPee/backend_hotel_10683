const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const seasonValidator = require("../utils/seasonValidator");

const getAllSeason = async (req, res) => {
  let response = null;
  const getSeasonMessage = "Data Season berhasil diterima";

  try {
    const season = await prisma.season.findMany();

    if (!season) {
      const response = new Response.Error(true, "Data Season Kosong");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    response = new Response.Success(true, getSeasonMessage, season);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getSeasonByJenis = async (req, res) => {
  let response = null;

  try {
    const jenisSeason = req.params.jenis_season;
    
    const season = await prisma.season.findMany({
      where: {
        jenisSeason: jenisSeason,
      },
    });

    if (!season) {
      return res.status(200).json({
        status: "success",
        message: `Tidak ada data Season dengan jenis ${jenisSeason}`,
      });
    }

    const response = new Response.Success(false, "success", { Seasons });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addSeason = async (req, res) => {
  let response = null;
  try {
    const addSeason = await seasonValidator.validateAsync(req.body);
    
    const season = await prisma.season.create({
      data: addSeason,
    });

    const response = new Response.Success(
      false,
      "Season berhasil dibuat",
      season
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    console.error(error);
    const response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateSeason = async (req, res) => {
  
  let response = null;

  try {
    const id = req.params.id;
    const updatedSeason = await seasonValidator.validateAsync(req.body);

    const season = await prisma.season.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!season) {
      const response = new Response.Error(true, "Data Season Tidak Ada");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const updated = await prisma.season.update({
      where: {
        id: parseInt(id),
      },

      data: updatedSeason,
    });

    const response = new Response.Success(
      false,
      "Season berhasil diperbarui",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteSeason = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const season = await prisma.season.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!season) {
      const response = new Response.Error(true, "Data Season Tidak Ada");
      res.status(httpStatus.BAD_REQUEST).json(response);
      return;
    }

    const deleted = await prisma.season.delete({
      where: {
        id: parseInt(id),
      },
    });

    const response = new Response.Success(
      false,
      "Season berhasil dihapus",
      deleted
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getAllSeason,
  getSeasonByJenis,
  addSeason,
  updateSeason,
  deleteSeason,
};

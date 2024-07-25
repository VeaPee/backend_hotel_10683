const httpStatus = require("http-status");
const Response = require("../model/Response");
const prisma = require("../prisma/client");
const fasilitasValidator = require("../utils/fasilitasValidator");

const getAllFasilitas = async (req, res) => {
  let response = null;
  const getFasilitasMessage = "Data Fasilitas berhasil diterima (TESTING CI/CD) 25/07/2024 15:18";

  try {
    const fasilitas = await prisma.fasilitasTambahan.findMany();

    if (fasilitas.length === 0) {
      const response = new Response.Error(true, "error", "Data Fasilitas Kosong");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    response = new Response.Success(false, "success",getFasilitasMessage, fasilitas);
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    const response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getFasilitasByID = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;

    const fasilitasTambahan = await prisma.fasilitasTambahan.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!fasilitasTambahan) {
      const response = new Response.Error(true, "error","Data Fasilitas Tambahan Tidak Ada");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const response = new Response.Success(false, "success", "success", { fasilitasTambahan });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const getFasilitasByNama = async (req, res) => {
  let response = null;
  try {
    const nama_fasilitas = req.params.nama_fasilitas;

    const fasilitas = await prisma.fasilitasTambahan.findMany({
      where: {
        nama_fasilitas: nama_fasilitas,
      },
    });

    if (fasilitas.length === 0) {
      return res.status(200).json({
        status: "success",
        message: `Tidak ada data Fasilitas dengan nama ${nama_fasilitas}`,
      });
    }

    const response = new Response.Success(false, "success", { fasilitas });
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const addFasilitas = async (req, res) => {
  let response = null;
  try {
    const addFasilitas = await fasilitasValidator.validateAsync(req.body);

    const fasilitas = await prisma.fasilitasTambahan.create({
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
    response = new Response.Error(true, "error",error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const updateFasilitas = async (req, res) => {
  let response = null;

  try {
    const id = req.params.id;
    const updatedFasilitas = await fasilitasValidator.validateAsync(req.body);

    const fasilitas = await prisma.fasilitasTambahan.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!fasilitas) {
      const response = new Response.Error(true, "error", "Data Fasilitas Tidak Ada");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const updated = await prisma.fasilitasTambahan.update({
      where: {
        id: parseInt(id),
      },

      data: updatedFasilitas,
    });

    const response = new Response.Success(
      false,
      "success",
      "Fasilitas berhasil diperbarui",
      updated
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true,"error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

const deleteFasilitas = async (req, res) => {
  const id = req.params.id;
  let response = null;

  try {
    const fasilitas = await prisma.fasilitasTambahan.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!fasilitas) {
      const response = new Response.Error(true,"error", "Data Fasilitas Tidak Ada");
      res.status(httpStatus.NOT_FOUND).json(response);
      return;
    }

    const deleted = await prisma.fasilitasTambahan.delete({
      where: {
        id: parseInt(id),
      },
    });

    const response = new Response.Success(
      false,
      "success",
      "Fasilitas berhasil dihapus",
      deleted
    );
    res.status(httpStatus.OK).json(response);
  } catch (error) {
    response = new Response.Error(true,"error", error.message);
    res.status(httpStatus.BAD_REQUEST).json(response);
  }
};

module.exports = {
  getAllFasilitas,
  getFasilitasByID,
  getFasilitasByNama,
  addFasilitas,
  updateFasilitas,
  deleteFasilitas,
};

const prisma = require('../prisma/prisma')

const getAllKamar = async (req, res) => {
  const kamar = await prisma.kamar.findMany()

  res.send(kamar)
}

const getKamar = async (req, res) => {
  const kamar = await prisma.kamar.find({
    id: req.params.id
  })

  res.send(kamar)
}

const addKamar = async (req, res) => {
  const newKamar = req.body
  const result = await prisma.kamar.create({
    data: newKamar
  })

  res.send(result)
}

const updateKamar = async (req, res) => {
  const id = req.params.id
  const updatedKamar = req.body

  const result = await prisma.kamar.update({
    where: {
      ID_KAMAR: parseInt(id)
    },

    data: updatedKamar
  })

  res.send(result)
}

const deleteKamar = async (req, res) => {
  const id = req.params.id
  const result = await prisma.kamar.delete({
    where: {
      ID_KAMAR: parseInt(id)
    }
  })

  res.send(`Deleted: ${result}`)
}

module.exports = {
  getAllKamar,
  getKamar,
  addKamar,
  updateKamar,
  deleteKamar
}
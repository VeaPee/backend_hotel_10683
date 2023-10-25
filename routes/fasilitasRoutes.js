const express = require('express');

const router = new express.Router();
const Auth = require('../middleware/auth');
const fasilitasController = require('../controller/fasilitasController');

router.use(Auth);
router.get('/getAllFasilitas', fasilitasController.getAllFasilitas);
router.get('/getFasilitasByID/:id', fasilitasController.getFasilitasByID);
router.get('/getFasilitasByNama/:nama_fasilitas', fasilitasController.getFasilitasByNama);
router.post('/addFasilitas', fasilitasController.addFasilitas);
router.put('/updateFasilitas/:id', fasilitasController.updateFasilitas);
router.delete('/deleteFasilitas/:id', fasilitasController.deleteFasilitas);

module.exports = router;
const express = require('express');

const router = new express.Router();
const Auth = require('../middleware/auth');
const tarifController = require('../controller/tarifController');

router.use(Auth);
router.get('/getAllTarif', tarifController.getAllTarif);
router.get('/getTarifByKamar/:kamarId', tarifController.getTarifByKamar);
router.get('/getTarifByHarga/:harga', tarifController.getTarifByHarga);
router.get('/getTarifByRangeHarga/:min/:max', tarifController.getTarifByRangeHarga);
router.post('/addTarif', tarifController.addTarif);
router.put('/updateTarif/:id', tarifController.updateTarif);
router.delete('/deleteTarif/:id', tarifController.deleteTarif);

module.exports = router;
const express = require('express');

const router = new express.Router();
const Auth = require('../middleware/auth');
const tarifController = require('../controller/tarifController');

router.use(Auth);
router.get('/getAllTarif', tarifController.getAllTarif);
router.get('/getTarifByHarga/:min/:max', tarifController.getTarifByHarga);
router.post('/addTarif', tarifController.addTarif);
router.put('/updateTarif/:id', tarifController.updateTarif);
router.delete('/deleteTarif/:id', tarifController.deleteTarif);

module.exports = router;
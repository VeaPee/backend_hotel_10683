const express = require('express');

const router = new express.Router();
const kamarController = require('../controller/kamarController');

router.get('/kamar/getAllKamar', kamarController.getAllKamar);
router.get('/kamar/getKamar/:id', kamarController.getKamar);
router.put('/kamar/updateKamar/:id', kamarController.updateKamar);
router.delete('/kamar/deleteKamar/:id', kamarController.deleteKamar);

module.exports = router;
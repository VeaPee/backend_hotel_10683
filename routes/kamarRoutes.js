const { Router } = require('express');

const router = Router();

const kamarController = require('../controllers/kamarController');

// Kamar Routes
router.get('/kamar/getAllKamar', kamarController.getAllKamar);
router.post('/kamar/addKamar', kamarController.addKamar);
router.put('/kamar/updateKamar/:id', kamarController.updateKamar);
router.delete('/kamar/deleteKamar/:id', kamarController.deleteKamar);

module.exports = router;
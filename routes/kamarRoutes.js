const express = require('express');

const router = new express.Router();
const Auth = require('../middleware/auth');
const kamarController = require('../controller/kamarController');

router.use(Auth);
router.get('/getAllKamar', kamarController.getAllKamar);
router.get('/getKamarByJenis/:jenisKamar', kamarController.getKamarByJenis);
router.post('/addKamar', kamarController.addKamar);
router.put('/updateKamar/:id', kamarController.updateKamar);
router.delete('/deleteKamar/:id', kamarController.deleteKamar);

module.exports = router;
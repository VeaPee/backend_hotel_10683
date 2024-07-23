const express = require('express');

const router = new express.Router();
// const Auth = require('../middleware/auth');
const kamarController = require('../controller/kamarController');

// router.use(Auth);
router.get('/getAllKamar', kamarController.getAllKamar);
router.get('/getKamarByID/:id', kamarController.getKamarByID);
router.get('/getKamarByJenis/:jenisKamar', kamarController.getKamarByJenis);
router.post('/addKamar', kamarController.addKamar);
router.put('/updateKamar/:id', kamarController.updateKamar);
router.delete('/deleteKamar/:id', kamarController.deleteKamar);

router.get('/getAllNomorKamar', kamarController.getAllNomorKamar);
router.get('/getNomorKamarByID/:id', kamarController.getNomorKamarByID);
router.post('/addNomorKamar', kamarController.addNomorKamar);
router.put('/updateNomorKamar/:id', kamarController.updateNomorKamar);
router.delete('/deleteNomorKamar/:id', kamarController.deleteNomorKamar);


router.post('/checkKamarAvailability', kamarController.checkKamarAvailability);

module.exports = router;
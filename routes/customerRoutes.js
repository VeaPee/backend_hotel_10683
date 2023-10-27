const express = require('express');
const router = new express.Router();
const Auth = require('../middleware/auth');
const customerController = require('../controller/customerController');

router.use(Auth);
router.get('/getCustomer', customerController.getCustomer);
router.get('/getCustomerByID/:id', customerController.getCustomerByID);
router.post('/addCustomer', customerController.addCustomer);
router.put('/updateCustomer/:id', customerController.updateCustomer);

router.get('/getRiwayatTransaksi', customerController.getRiwayatTransaksi);
router.get('/getRiwayatTransaksi/:id', customerController.getDetailRiwayatTransaksi);

module.exports = router;
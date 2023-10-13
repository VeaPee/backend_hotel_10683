const express = require('express');
const router = new express.Router();
const Auth = require('../middleware/auth');
const customerController = require('../controller/customerController');

router.use(Auth);
router.get('/getCustomer', customerController.getCustomer);
router.post('/addCustomer', customerController.addCustomer);
router.put('/updateCustomer/:id', customerController.updateCustomer);

module.exports = router;
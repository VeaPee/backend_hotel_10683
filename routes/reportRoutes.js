const express = require('express');

const router = express.Router();
// const Auth = require('../middleware/auth');
const reportController = require('../controller/reportController');

// router.use(Auth);
router.get('/getAllCustomer', reportController.getAllCustomer);
router.get('/getTopCustomer', reportController.getTopCustomer);

module.exports = router;
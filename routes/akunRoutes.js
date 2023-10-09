const express = require('express');

const router = express.Router();
const Auth = require('../middleware/auth');
const akunController = require('../controller/akunController');

router.use(Auth);
router.get('/profile', akunController.getAkun);
router.put('/edit-password', akunController.updatePassword);

module.exports = router;
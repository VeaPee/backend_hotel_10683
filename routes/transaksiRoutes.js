const express = require('express');

const router = new express.Router();
const Auth = require('../middleware/auth');
const transaksiController = require('../controller/transaksiController');

router.use(Auth);
router.post('/transaksiReservasi', transaksiController.transaksiReservasi);
router.post('/transaksiKamar', transaksiController.transaksiKamar);
router.post('/transaksiFasilitas', transaksiController.transaksiFasilitas);
router.post('/konfirmasiPembayaran', transaksiController.konfirmasiPembayaran);
router.delete('/pembatalanReservasi/:id', transaksiController.pembatalanReservasi);

module.exports = router;
const express = require('express');

const router = new express.Router();
// const Auth = require('../middleware/auth');
const seasonController = require('../controller/seasonController');

// router.use(Auth);
router.get('/getAllSeason', seasonController.getAllSeason);
router.get('/getSeasonByID/:id', seasonController.getSeasonByID);
router.get('/getSeasonByJenis/:jenis_season', seasonController.getSeasonByJenis);
router.post('/addSeason', seasonController.addSeason);
router.put('/updateSeason/:id', seasonController.updateSeason);
router.delete('/deleteSeason/:id', seasonController.deleteSeason);

module.exports = router;
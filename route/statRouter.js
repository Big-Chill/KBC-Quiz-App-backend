const express = require('express');
const path = require('path');
const statController = require(path.join(__dirname, '..', 'controller', 'statController'));
const authenticateJwt = require(path.join(__dirname, '..', 'middleware', 'authenticateJwt'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));

const router = express.Router();

router.use(authenticateJwt);

router.get('/all', authenticateAdmin, statController.getAllStats);
router.get('/get/:userId', statController.getStatById);
router.get('/getStatByIdAndCategory/:userId/:category', statController.getStatByIdAndCategory);
router.get('/getStatByIdAndDifficulty/:userId/:difficulty', statController.getStatByIdAndDifficulty);
router.get('/getStatByIdAndCategoryAndDifficulty/:userId/:category/:difficulty', statController.getStatByIdAndCategoryAndDifficulty);
router.get('/getTopNStatsOfDificultyOfUser/:userId/:difficulty/:n', statController.getTopNStatsOfDificultyOfUser);
router.get('/getTopNStatsOfCategoryOfUser/:userId/:category/:n', statController.getTopNStatsOfCategoryOfUser);
router.get('/getTopNStatsOfCategoryAndDifficultyOfUser/:userId/:category/:difficulty/:n', statController.getTopNStatsOfCategoryAndDifficultyOfUser);
router.get('/getTopNStatsOfUser/:userId/:n', statController.getTopNStatsOfUser);
router.post('/add/:userId', statController.addStat);

module.exports = router;
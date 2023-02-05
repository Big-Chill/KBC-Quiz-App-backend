const express = require('express');
const path = require('path');
const difficultyController = require(path.join(__dirname, '..', 'controller', 'difficultyController'));
const authenticateJwt = require(path.join(__dirname, '..', 'middleware', 'authenticateJwt'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));

const router = express.Router();

router.use(authenticateJwt);

router.get('/all', difficultyController.getAllDifficulties);
router.post('/add', authenticateAdmin, difficultyController.addDifficulty);

module.exports = router;
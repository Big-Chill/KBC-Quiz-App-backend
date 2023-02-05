const express = require('express');
const path = require('path');
const profileController = require(path.join(__dirname, '..', 'controller', 'profileController'));
const authenticateJwt = require(path.join(__dirname, '..', 'middleware', 'authenticateJwt'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));

const router = express.Router();

router.use(authenticateJwt);

router.get('/all', authenticateAdmin, profileController.getAllProfiles);
router.get('/isProfilePresent', profileController.isProfilePresent);
router.get('/getByUserId', profileController.getProfileByUserId);
router.post('/add', profileController.addProfile);
router.put('/updateByUserId', profileController.updateProfile);

module.exports = router;

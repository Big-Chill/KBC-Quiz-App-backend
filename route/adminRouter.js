const express = require('express');
const path = require('path');
const adminController = require(path.join(__dirname, '..', 'controller', 'adminController'));
const authenticateJWT = require(path.join(__dirname, '..', 'middleware', 'authenticateJWT'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));
const router = express.Router();

router.use(authenticateJWT);
router.use(authenticateAdmin);


router.get('/all', adminController.getAllAdmins);
router.post('/add', adminController.addAdmin);
router.delete('/delete', adminController.deleteAdmin);

module.exports = router;
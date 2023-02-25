const express = require('express');
const path = require('path');
const userController = require(path.join(__dirname, '..', 'controller', 'userController'));
const authenticateJwt = require(path.join(__dirname, '..', 'middleware', 'authenticateJwt'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));

const router = express.Router();

router.get('/getUserId', authenticateJwt, userController.getUserId);
router.get('/all', authenticateJwt, authenticateAdmin, userController.getAllUsers);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.put('/changePassword/:email', authenticateJwt, authenticateAdmin, userController.changePassword);
router.delete('/delete/:email', authenticateJwt, authenticateAdmin, userController.deleteUser);

module.exports = router;
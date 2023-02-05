const express = require('express');
const path = require('path');
const categoryController = require(path.join(__dirname, '..', 'controller', 'categoryController'));
const authenticateJwt = require(path.join(__dirname, '..', 'middleware', 'authenticateJwt'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));

const router = express.Router();

router.use(authenticateJwt);

router.get('/all', categoryController.getAllCategories);
router.post('/add', authenticateAdmin, categoryController.addCategory);

module.exports = router;
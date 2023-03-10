const express = require('express');
const path = require('path');
const multer = require('multer');
const profileController = require(path.join(__dirname, '..', 'controller', 'profileController'));
const authenticateJwt = require(path.join(__dirname, '..', 'middleware', 'authenticateJwt'));
const authenticateAdmin = require(path.join(__dirname, '..', 'middleware', 'authenticateAdmin'));

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },

  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.use(authenticateJwt);

router.get('/all', authenticateAdmin, profileController.getAllProfiles);
router.get('/isProfilePresent', profileController.isProfilePresent);
router.get('/getByUserId', profileController.getProfileByUserId);
router.post('/add', upload.single('profileImage'), profileController.addProfile);
router.put('/updateByUserId', upload.single('profileImage'), profileController.updateProfile);

module.exports = router;

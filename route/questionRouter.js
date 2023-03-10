const express = require('express');
const path = require('path');
const multer = require('multer');
const questionController = require(path.join(__dirname, '..', 'controller', 'questionController'));
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

router.get('/all', questionController.getAllQuestions);
router.get('/all/paginated', authenticateAdmin, questionController.getQuestionsPaginated)
router.get('/all/count', authenticateAdmin, questionController.getTotalCount)
router.get('/get/:id', questionController.getQuestionById);
router.get('/getByCategory/:category', questionController.getQuestionsByCategory);
router.get('/getByDifficulty/:difficulty', questionController.getQuestionsByDifficulty);
router.get('/getByCategoryAndDifficulty/:category/:difficulty', questionController.getQuestionsByCategoryAndDifficulty);
router.post('/add', authenticateAdmin, questionController.addQuestion);
router.post('/addBulk', authenticateAdmin,  upload.single('file'), questionController.addBulkQuestions);
router.put('/update/:id', authenticateAdmin, questionController.updateQuestion);
router.delete('/delete/:id', authenticateAdmin, questionController.deleteQuestion);

module.exports = router;

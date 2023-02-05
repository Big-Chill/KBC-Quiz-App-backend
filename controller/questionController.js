const path = require('path');
const questionModel = require(path.join(__dirname, '..', 'model', 'question'));
const categoryModel = require(path.join(__dirname, '..', 'model', 'category'));
const difficultyModel = require(path.join(__dirname, '..', 'model', 'difficulty'));

// /api/question/all
const getAllQuestions = async (req, res) => {
  const { n } = req.query;
  let questions;
  if (n) {
    try {
      questions = await questionModel.find().limit(parseInt(n));
    } catch (err) {
      return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
    }
    return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
  }

  try {
    questions = await questionModel.find();
  } catch (err) {
    return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
  }

  return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
};

// /api/question/add
const addQuestion = async (req, res) => {
  const { question, options, answer, category, difficulty } = req.body;

  if (!question || !options || !answer || !category || !difficulty) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty' });
  }

  const createdQuestion = new questionModel({ question: question, options: options, answer: answer, category: categoryObj, difficulty: difficultyObj });

  try {
    await createdQuestion.save();
  } catch (err) {
    return res.status(500).json({ message: 'Adding question failed, please try again later.' });
  }

  return res.status(201).json({ message: 'Question added successfully.', question: createdQuestion.toObject({ getters: true }) });
};

// /api/question/get/:id
const getQuestionById = async (req, res) => {
  const questionId = req.params.id;
  let question;
  try {
    question = await questionModel.findById(questionId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching question failed, please try again later.' });
  }

  if (!question) {
    return res.status(404).json({ message: 'Could not find question for the provided id.' });
  } else {
    return res.status(200).json({ question: question.toObject({ getters: true }) });
  }
};

// /api/question/update/:id
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, options, answer, category, difficulty } = req.body;

  if (!question || !options || !answer || !category || !difficulty) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  let categoryObj;

  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category' });
  }

  let difficultyObj;

  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty' });
  }



  try {
    const updatedQuestion = await questionModel.findByIdAndUpdate(id, { question: question, options: options, answer: answer, category: categoryObj, difficulty: difficultyObj }, { new: true });
    res.status(200).json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// /api/question/delete/:id
const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    await questionModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// /api/question/getByCategory/:category
const getQuestionsByCategory = async (req, res) => {
  const { category } = req.params;
  const { n } = req.query;

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category' });
  }

  let questions;
  if (n) {
    try {
      questions = await questionModel.find({ category: categoryObj }).limit(parseInt(n));
    } catch (err) {
      return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
    }

    return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
  }
  try {
    questions = await questionModel.find({ category: categoryObj });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
  }

  return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
};

// /api/question/getByDifficulty/:difficulty
const getQuestionsByDifficulty = async (req, res) => {
  const { difficulty } = req.params;
  const { n } = req.query;

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty' });
  }

  let questions;

  if (n) {
    try {
      questions = await questionModel.find({ difficulty: difficultyObj }).limit(parseInt(n));
    } catch (err) {
      return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
    }

    return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
  }

  try {
    questions = await questionModel.find({ difficulty: difficultyObj });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
  }

  return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
};

// /api/question/getByCategoryAndDifficulty/:category/:difficulty

const getQuestionsByCategoryAndDifficulty = async (req, res) => {
  const { category, difficulty } = req.params;
  const { n } = req.query;

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty' });
  }


  let questions;

  if (n) {
    try {
      questions = await questionModel.find({ category: categoryObj, difficulty: difficultyObj }).limit(parseInt(n));
    } catch (err) {
      return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
    }

    return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
  }

  try {
    questions = await questionModel.find({ category: categoryObj, difficulty: difficultyObj });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching questions failed, please try again later.' });
  }

  return res.status(200).json({ questions: questions.map(question => question.toObject({ getters: true })) });
};

module.exports = {
  getAllQuestions,
  addQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getQuestionsByCategoryAndDifficulty,
};
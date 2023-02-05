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


const getTotalCount = async (req, res) => {
  try {
    const count = await questionModel.countDocuments();
    return res.status(200).json({ count: count });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching count failed, please try again later.' });
  }
};


const getQuestionsPaginated = async (req, res) => {
  const { page, limit } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < await questionModel.countDocuments().exec()) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  try {
    results.results = await questionModel.find().limit(limit * 1).skip(startIndex).exec();
    res.paginatedResults = results;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  let filtered_results = res.paginatedResults.results;

  let finalData = [];
  // Fetch difficulty names for each document

  for (let i = 0; i < filtered_results.length; i++) {
    let difficulty;
    try {
      difficulty = await difficultyModel.findById(filtered_results[i].difficulty);
    } catch (err) {
      return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
    }

    let category;
    try {
      category = await categoryModel.findById(filtered_results[i].category);
    } catch (err) {
      return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
    }

    let obj = {
      _id: filtered_results[i]._id,
      question: filtered_results[i].question,
      options: filtered_results[i].options,
      answer: filtered_results[i].answer,
      category: category.name,
      difficulty: difficulty.name
    }
    finalData.push(obj);
  }

  res.status(200).json({ questions: finalData});
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
  getTotalCount,
  getQuestionsPaginated,
  addQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getQuestionsByCategoryAndDifficulty,
};
const path = require('path');
const userModel = require(path.join(__dirname, '..', 'model', 'user'));
const categoryModel = require(path.join(__dirname, '..', 'model', 'category'));
const difficultyModel = require(path.join(__dirname, '..', 'model', 'difficulty'));
const statModel = require(path.join(__dirname, '..', 'model', 'stat'));

// api/stat/all
const getAllStats = async (req, res) => {
  let stats;
  try {
    stats = await statModel.find();
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};

// api/stat/add
const addStat = async (req, res) => {
  const { userId } = req.params;
  const { category, difficulty, userScore, totalScore, totalQuestions, totalCorrect, totalIncorrect, date } = req.body;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name : category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category for provided name.' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty for provided name.' });
  }

  const marksPercentage = (parseInt(userScore) / parseInt(totalScore)) * 100;

  const createdStat = new statModel({ user: userId, category: categoryObj._id, difficulty: difficultyObj._id, userScore:parseInt(userScore), totalScore: parseInt(totalScore), totalQuestions: parseInt(totalQuestions), totalCorrect: parseInt(totalCorrect), totalIncorrect: parseInt(totalIncorrect), marksPercentage: marksPercentage, date: date });

  try {
    await createdStat.save();
  } catch (err) {
    return res.status(500).json({ message: 'Creating stat failed, please try again later.' });
  }

  return res.status(201).json({ stat: createdStat.toObject({ getters: true }) });

};


// api/stat/get/:id
const getStatById = async (req, res) => {
  const { userId } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user }).sort({ date: 1 });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};

// api/stat/get/:id/:category

const getStatByIdAndCategory = async (req, res) => {
  const { userId, category } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category for provided name.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user, category: categoryObj._id }).sort({ date: 1 });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};

// api/stat/get/:id/:difficulty
const getStatByIdAndDifficulty = async (req, res) => {
  const { userId, difficulty } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty for provided name.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user, difficulty: difficultyObj._id }).sort({ date: 1 });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};



// api/stat/get/:id/:category/:difficulty
const getStatByIdAndCategoryAndDifficulty = async (req, res) => {
  const { userId, category, difficulty } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category for provided name.' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty for provided name.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user, category: categoryObj._id, difficulty: difficultyObj._id }).sort({ date: 1 });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};


const getTopNStatsOfDificultyOfUser = async (req, res) => {
  const { userId, difficulty, n } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty for provided name.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user, difficulty: difficultyObj._id }).sort({ marksPercentage: -1 }).limit(parseInt(n));
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};

const getTopNStatsOfCategoryOfUser = async (req, res) => {
  const { userId, category, n } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category for provided name.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user, category: categoryObj._id }).sort({ marksPercentage: -1 }).limit(parseInt(n));
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};


const getTopNStatsOfCategoryAndDifficultyOfUser = async (req, res) => {
  const { userId, category, difficulty, n } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let categoryObj;
  try {
    categoryObj = await categoryModel.findOne({ name: category });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching category failed, please try again later.' });
  }

  if (!categoryObj) {
    return res.status(404).json({ message: 'Could not find category for provided name.' });
  }

  let difficultyObj;
  try {
    difficultyObj = await difficultyModel.findOne({ name: difficulty });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulty failed, please try again later.' });
  }

  if (!difficultyObj) {
    return res.status(404).json({ message: 'Could not find difficulty for provided name.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user, category: categoryObj._id, difficulty: difficultyObj._id }).sort({ marksPercentage: -1 }).limit(parseInt(n));
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};


const getTopNStatsOfUser = async (req, res) => {
  const { userId, n } = req.params;

  let user;
  try {
    user = await userModel.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user for provided id.' });
  }

  let stats;
  try {
    stats = await statModel.find({ user: user }).sort({ marksPercentage: -1 }).limit(parseInt(n));
  } catch (err) {
    return res.status(500).json({ message: 'Fetching stats failed, please try again later.' });
  }

  return res.status(200).json({ stats: stats.map(stat => stat.toObject({ getters: true })) });
};

module.exports = {
  getAllStats,
  addStat,
  getStatById,
  getStatByIdAndCategory,
  getStatByIdAndDifficulty,
  getStatByIdAndCategoryAndDifficulty,
  getTopNStatsOfDificultyOfUser,
  getTopNStatsOfCategoryOfUser,
  getTopNStatsOfCategoryAndDifficultyOfUser,
  getTopNStatsOfUser
};

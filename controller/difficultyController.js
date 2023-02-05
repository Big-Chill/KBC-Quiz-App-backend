const path = require('path');
const difficultyModel = require(path.join(__dirname, '..', 'model', 'difficulty'));

// /api/difficulty/all
const getAllDifficulties = async (req, res) => {
  let difficulties;
  try {
    difficulties = await difficultyModel.find();
  } catch (err) {
    return res.status(500).json({ message: 'Fetching difficulties failed, please try again later.' });
  }

  return res.status(200).json({ difficulties: difficulties.map(difficulty => difficulty.toObject({ getters: true })) });
};

// /api/difficulty/add
const addDifficulty = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  const createdDifficulty = new difficultyModel({ name: name });

  try {
    await createdDifficulty.save();
  } catch (err) {
    return res.status(500).json({ message: 'Adding difficulty failed, please try again later.' });
  }

  return res.status(201).json({ message: 'Difficulty added successfully.', difficulty: createdDifficulty.toObject({ getters: true }) });
};

module.exports = { getAllDifficulties, addDifficulty };
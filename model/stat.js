const mongoose = require('mongoose');
const { Schema } = mongoose;
const userModel = require('./user');
const categoryModel = require('./category');
const difficultyModel = require('./difficulty');

const statSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, ref: 'Category' },
  difficulty: { type: String, required: true, ref: 'Difficulty' },
  userScore: { type: Number, required: true },
  totalScore: { type: Number, required: true },
  marksPercentage: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  totalCorrect: { type: Number, required: true },
  totalIncorrect: { type: Number, required: true },
  date: { type: String, required: true }
});

const statModel = mongoose.model('Stat', statSchema);

module.exports = statModel;


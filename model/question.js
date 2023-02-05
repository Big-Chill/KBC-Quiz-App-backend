const mongoose = require('mongoose');
const { Schema } = mongoose;
const categoryModel = require('./category');
const difficultyModel = require('./difficulty');

const questionSchema = new Schema({
  question: { type: String, required: true, unique: true },
  options: { type: Array, required: true },
  answer: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  difficulty: { type: Schema.Types.ObjectId, ref: 'Difficulty', required: true }
});

const questionModel = mongoose.model('Question', questionSchema);

module.exports = questionModel;
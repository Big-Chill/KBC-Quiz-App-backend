const mongoose = require('mongoose');
const { Schema } = mongoose;

const difficultySchema = new Schema({
  name: { type: String, required: true }
});

const difficultyModel = mongoose.model('Difficulty', difficultySchema);

module.exports = difficultyModel;
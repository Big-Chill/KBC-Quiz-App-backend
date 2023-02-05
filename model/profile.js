const mongoose = require('mongoose');
const { Schema } = mongoose;
const userModel = require('./user');

const profileSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNo: { type: String, required: true },
  userId: { type: String, required: true, ref: userModel }
});

const profileModel = mongoose.model('Profile', profileSchema);

module.exports = profileModel;
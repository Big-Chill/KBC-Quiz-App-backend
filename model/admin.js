const mongoose = require('mongoose');
const { Schema } = mongoose;
const userModel = require('./user');

const adminSchema = new Schema({
  email: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const adminModel = mongoose.model('Admin', adminSchema);

module.exports = adminModel;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require(path.join(__dirname, '..', 'model', 'user'));
const adminModel = require(path.join(__dirname, '..', 'model', 'admin'));
const profileModel = require(path.join(__dirname, '..', 'model', 'profile'));
const statModel = require(path.join(__dirname, '..', 'model', 'stat'));


// POST /api/user/signup

const signUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Signing up failed, please try again later.' });
  }

  if (existingUser) {
    return res.status(422).json({ message: 'User exists already, please login instead.' });
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({ message: 'Could not create user, please try again.' });
  }


  const createdUser = new userModel({ email: email, password: hashedPassword });

  try {
    await createdUser.save();
  } catch (err) {
    return res.status(500).json({ message: 'Signing up failed, please try again later.' });
  }

  return res.status(201).json({ message: 'User created successfully.', user: createdUser.toObject({ getters: true }) });
};

// POST /api/user/login

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Logging in failed, please try again later.' });
  }

  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(500).json({ message: 'Could not log you in, please check your credentials and try again.' });
  }

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, 'supersecret_dont_share');
  } catch (err) {
    return res.status(500).json({ message: 'Logging in failed, please try again later.' });
  }

  let isAdmin = false;
  try {
    isAdmin = await adminModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Logging in failed, please try again later.' });
  }

  let existingProfile;
  try {
    existingProfile = await profileModel.findOne({ userId: existingUser.id });
  } catch (err) {
    return res.status(500).json({ message: 'Logging in failed, please try again later.' });
  }

  let profileId = null;
  if (existingProfile) {
    profileId = existingProfile.id;
  }


  return res.status(200).json({ userId: existingUser.id, email: existingUser.email, token: token, isAdmin: isAdmin ? true : false, profileId: profileId, userCreatedAt: new Date(existingUser.createdAt).getTime() });
};



// GET /api/user/all

const getAllUsers = async (req, res) => {
  let users;
  try {
    users = await userModel.find({}, '-password');
  } catch (err) {
    return res.status(500).json({ message: 'Fetching users failed, please try again later.' });
  }

  users = users.map(user => user.toObject({ getters: true }));

  final_data = [];

  for (let i = 0; i < users.length; i++) {
    let isAdmin = false;
    try {
      isAdmin = await adminModel.findOne({ email: users[i].email });
    } catch (err) {
      return res.status(500).json({ message: 'Fetching users failed, please try again later.' });
    }
    final_data.push({ ...users[i], isAdmin: isAdmin ? true : false });
  }

  return res.status(200).json({ users: final_data });
};


const getUserId = async (req, res) => {
  const { email } = req.query;

  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'User Id fetching failed, please try again later.' });
  }

  if (!existingUser) {
    return res.status(401).json({ message: 'User not found.' });
  }

  return res.status(200).json({ userId: existingUser.id });
};


const deleteUser = async (req, res) => {
  const { email } = req.params;

  let existingUser;
  try {
      existingUser = await userModel.findOne({ email: email });
  } catch (err) {
      return res.status(500).json({ message: 'User deletion failed, please try again later' });
  }

  if (!existingUser) {
      return res.status(401).json({ message: 'User not found.' });
  }


  try {
    await existingUser.remove();
    await statModel.deleteMany({ user: existingUser.id });
    await profileModel.deleteMany({ userId: existingUser.id });
    await adminModel.deleteMany({ user: existingUser.id });
  } catch (err) {
      return res.status(500).json({ message: 'User deletion failed, please try again later' });
  }

  return res.status(200).json({ message: 'User deleted successfully.' });
};

const changePassword = async (req, res) => {
  const { email } = req.params;
  const { password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  let existingUser;
  try {
      existingUser = await userModel.findOne({ email: email });
  } catch (err) {
      return res.status(500).json({ message: 'Password change failed, please try again later' });
  }

  if (!existingUser) {
      return res.status(401).json({ message: 'User not found.' });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({ message: 'Could not change password, please try again.' });
  }

  let updatedUser;
  try {
    updatedUser = await userModel.findByIdAndUpdate(existingUser.id, { password: hashedPassword }, { new: true });
  } catch (err) {
    return res.status(500).json({ message: 'Could not change password, please try again.' });
  }

  return res.status(200).json({ message: 'Password changed successfully.' });
};



module.exports = { signUp, login, getAllUsers, getUserId, deleteUser, changePassword };
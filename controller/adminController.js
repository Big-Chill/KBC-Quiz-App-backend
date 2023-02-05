const path = require('path');
const adminModel = require(path.join(__dirname, '..', 'model', 'admin'));
const userModel = require(path.join(__dirname, '..', 'model', 'user'));

const addAdmin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  let user;
  try {
    user = await userModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Could not find user' });
  }

  let existingAdmin;
  try {
    existingAdmin = await adminModel.findOne({ user: user });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching admin failed, please try again later.' });
  }

  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin already exists.' });
  }

  const createdAdmin = new adminModel({ email: email, user: user });

  try {
    await createdAdmin.save();
  } catch (err) {
    return res.status(500).json({ message: 'Adding admin failed, please try again later.' });
  }

  return res.status(201).json({ message: 'Admin added successfully.', admin: createdAdmin.toObject({ getters: true }) });
};

const getAllAdmins = async (req, res) => {
  let admins;
  try {
    admins = await adminModel.find();
  } catch (err) {
    return res.status(500).json({ message: 'Fetching admins failed, please try again later.' });
  }

  return res.status(200).json({ admins: admins.map(admin => admin.toObject({ getters: true })) });
};

const deleteAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    await adminModel.deleteOne({ email: email });
    res.status(200).json({ message: 'Admin deleted successfully.' });
  }
  catch (err) {
    return res.status(500).json({ message: 'Deleting admin failed, please try again later.' });
  }
};

module.exports = {
  addAdmin,
  getAllAdmins,
  deleteAdmin
};
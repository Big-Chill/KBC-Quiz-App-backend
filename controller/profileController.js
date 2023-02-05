const path = require('path');
const profileModel = require(path.join(__dirname, '..', 'model', 'profile'));
const userModel = require(path.join(__dirname, '..', 'model', 'user'));

// /api/profile/all
const getAllProfiles = async (req, res) => {
  let profiles;
  try {
    profiles = await profileModel.find();
  } catch (err) {
    return res.status(500).json({ message: 'Fetching profiles failed, please try again later.' });
  }

  return res.status(200).json({ profiles: profiles.map(profile => profile.toObject({ getters: true })) });
};

const isProfilePresent = async (req, res) => {
  const { email } = req.query;

  let profile;
  try {
    profile = await profileModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching profile failed, please try again later.' });
  }

  if (!profile) {
    return res.status(200).json({ message: 'Profile not found' });
  } else {
    return res.status(200).json({ message: 'Profile found' });
  }
};

// /api/profile/add
const addProfile = async (req, res) => {
  const { name, email, phoneNo } = req.body;

  if (!name || !email || !phoneNo) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  let user;
  try {
    user = await userModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching user failed, please try again later.' });
  }

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  let existingProfile;
  try {
    existingProfile = await profileModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching profile failed, please try again later.' });
  }

  if (existingProfile) {
    return res.status(400).json({ message: 'Profile already exists.' });
  }

  const createdProfile = new profileModel({ name: name, email: email, phoneNo: phoneNo, userId: user._id });

  try {
    await createdProfile.save();
  } catch (err) {
    return res.status(500).json({ message: 'Adding profile failed, please try again later.' });
  }

  return res.status(201).json({ message: 'Profile added successfully.', profile: createdProfile.toObject({ getters: true }) });
};

// /api/profile/
const getProfileByUserId = async (req, res) => {
  const { userId } = req.query;

  let profile;
  try {
    profile = await profileModel.findOne({ userId: userId });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching profile failed, please try again later.' });
  }

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found.' });
  }

  return res.status(200).json({ profile: profile.toObject({ getters: true }) });
};


// /api/profile/update
const updateProfile = async (req, res) => {
  const { userId } = req.query;
  const { phoneNo } = req.body;

  if (!phoneNo) {
    return res.status(400).json({ message: 'Please enter your phone number.' });
  }


  try {
    let profile = await profileModel.findOneAndUpdate({ userId: userId }, { phoneNo: phoneNo});
    return res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Fetching profile failed, please try again later.' });
  }
};


module.exports = {
  getAllProfiles,
  isProfilePresent,
  addProfile,
  getProfileByUserId,
  updateProfile
};
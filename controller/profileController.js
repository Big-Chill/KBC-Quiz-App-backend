const path = require('path');
const AWS = require('aws-sdk');
const profileModel = require(path.join(__dirname, '..', 'model', 'profile'));
const userModel = require(path.join(__dirname, '..', 'model', 'user'));

const endpoint = new AWS.Endpoint(process.env.ENDPOINT);
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY;
const s3 = new AWS.S3({
  endpoint: endpoint,
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

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
  const { name, email, phoneNo } = JSON.parse(req.body.profile);
  const file = req.file;


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

  var imgUrl = '';

  if (file) {
    const params = {
      Bucket: `${process.env.BUCKET_NAME}/Profile Images`,
      Key: `${user._id}_profile image.jpg`,
      Body: file.buffer,

    };
    await s3.putObject(params).promise();
    imgUrl = `${process.env.BUCKET_URL}/Profile Images/${user._id}_profile image.jpg`;
  }



  const createdProfile = new profileModel({ name: name, email: email, phoneNo: phoneNo, userId: user._id, image: imgUrl });

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
  const { phoneNo, oldImgUrl } = JSON.parse(req.body.profile);
  const file = req.file;


  if (!phoneNo) {
    return res.status(400).json({ message: 'Please enter your phone number.' });
  }

  var imgUrl = '';
  if (file) {
    let params = {
      Bucket: `${process.env.BUCKET_NAME}/Profile Images`,
      Key: `${userId}_profile image.jpg`,
    };

    await s3.deleteObject(params).promise();

    params.Body = file.buffer;
    await s3.putObject(params).promise();
    imgUrl = `${process.env.BUCKET_URL}/Profile Images/${userId}_profile image.jpg`;
  }

  if (oldImgUrl && !file) {
    imgUrl = oldImgUrl;
  }

  try {
    let profile = await profileModel.findOneAndUpdate({ userId: userId }, { phoneNo: phoneNo, image: imgUrl }, { new: true });
    return res.status(200).json({ message: 'Profile updated successfully.', profile: profile.toObject({ getters: true }) });
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
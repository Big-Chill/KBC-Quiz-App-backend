const path = require('path');
const adminModel = require(path.join(__dirname, '..', 'model', 'admin'));

const isAdmin = async (req, res, next) => {
  const { userId } = req.userData;

  const { email } = userId;

  let admin;
  try {
    admin = await adminModel.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: 'Authentication failed, please try again later.' });
  }

  if (!admin) {
    return res.status(401).json({ message: 'You are not authorized to perform this action.' });
  }

  next();
};

module.exports = isAdmin;
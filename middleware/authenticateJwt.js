const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require(path.join(__dirname, '..', 'model', 'user'));

const authenticateJwt = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Token not found' });
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    if (!decodedToken) {
      res.status(401).json({ message: 'Token not found' });
    }

    let existingUser;
    try {
      existingUser = await userModel.findOne({ email: decodedToken.email });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }

    if (!existingUser) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.userData = { userId: decodedToken };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authenticateJwt;
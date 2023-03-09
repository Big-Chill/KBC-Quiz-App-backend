const mongoose = require('mongoose');
const path = require('path');
const os = require('os');
const dotenv = require('dotenv');

if (os.platform() === 'win32') {
  dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`.trim()) });
}

const mongodb_url = process.env.MONGO_DB;


mongoose.set('strictQuery', false); // To allow queries like: Model.find({ $or: [{ name: 'John' }, { name: 'Jane' }] }


// Connect to MongoDB
mongoose.connect(mongodb_url, { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});
const mongoose = require('mongoose');

mongoose.set('strictQuery', false); // To allow queries like: Model.find({ $or: [{ name: 'John' }, { name: 'Jane' }] }

// Connect to MongoDB
mongoose.connect('mongodb+srv://DevilsBreath39:abcdwxyz@quiz-db.ubvgn2x.mongodb.net/Quiz_db', { useNewUrlParser: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});
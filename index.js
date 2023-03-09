const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const port = 3001;
const db = require(path.join(__dirname, 'config', 'mongoose'));
const corsOption = require(path.join(__dirname, 'config', 'cors'));
const userRouter = require(path.join(__dirname, 'route', 'userRouter'));
const questionRouter = require(path.join(__dirname, 'route', 'questionRouter'));
const categoryRouter = require(path.join(__dirname, 'route', 'categoryRouter'));
const difficultyRouter = require(path.join(__dirname, 'route', 'difficultyRouter'));
const adminRouter = require(path.join(__dirname, 'route', 'adminRouter'));
const profileRouter = require(path.join(__dirname, 'route', 'profileRouter'));
const statRouter = require(path.join(__dirname, 'route', 'statRouter'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.use('/api/user', userRouter);
app.use('/api/question', questionRouter);
app.use('/api/category', categoryRouter);
app.use('/api/difficulty', difficultyRouter);
app.use('/api/admin', adminRouter);
app.use('/api/profile', profileRouter);
app.use('/api/stat', statRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
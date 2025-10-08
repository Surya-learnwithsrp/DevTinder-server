const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/database');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//Routes


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(7777, () => {
      console.log('Server is running on port 7777');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });


// Basic Node.js server using Express
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//allow cross-origin requests
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the 1040 Automation Server!');
});

// Import routes
const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');

// Use routes
app.use('/api', authRoutes);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

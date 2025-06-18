// Basic Node.js server using Express
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the 1040 Automation Server!');
});

// Import routes
const authRoutes = require('./routes/auth');
const usersRouter = require('./routes/users');
const clientsRouter = require('./routes/clients');
const rolesRouter = require('./routes/roles');
const tasksRouter = require('./routes/tasks');
const toolsRouter = require('./routes/tools');
// Use routes
app.use('/api', authRoutes);
app.use('/api/users', usersRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/tools', toolsRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

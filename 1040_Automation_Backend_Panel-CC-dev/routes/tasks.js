const express = require('express');
const router = express.Router();
const { getTasksByIdController, getTasksByClientIdController, addTaskController, addTaskStatusController } = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload'); // Multer or similar middleware for file uploads
const validateTask = require('../middleware/validateTask'); // Custom validation middleware for task creation

// Route to get all task statuses for the logged-in user
router.get('/:id', authenticate, getTasksByIdController);
// Route to add a new task status for the logged-in user
router.post('/status/add', authenticate, addTaskStatusController);
// Route to get tasks by client ID
router.get('/by-client/:clientId', getTasksByClientIdController);
// Route to add a new task for a subclient of a client for the logged-in user, with file upload and validation
router.post('/add', authenticate, upload.array('files'), validateTask, addTaskController);

module.exports = router;

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
    createSubClientController,
    getSubClientsController,
    archiveSubClientController,
    unarchiveSubClientController,
    getSubClientByIdController,
} = require('../controllers/subclientController');

// Get all subclients
router.get('/', authenticate, getSubClientsController);
// Get subclients by User ID
router.get('/get', authenticate, getSubClientByIdController);
// Create a new subclient
router.post('/add', authenticate, createSubClientController);
// Archive a subclient by ID
router.patch('/:id/archive', authenticate, archiveSubClientController);
// Unarchive a subclient by ID
router.patch('/:id/unarchive', authenticate, unarchiveSubClientController);

module.exports = router;

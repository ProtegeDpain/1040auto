const express = require('express');
const router = express.Router();
const { createClientController, getClientsController, archiveClientController, unarchiveClientController, getClientsByUserIdController } = require('../controllers/clientController');
const subClientRouter = require('./subClients');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
// Sub-router for handling sub-client routes
router.use('/subclients', subClientRouter);

// Route to get all clients
router.get('/', authenticate, getClientsController);

// Route to get all clients for a user by userId
router.get('/user/:userId', authenticate, getClientsByUserIdController);

// Route to create a new client
router.post('/add', authenticate, createClientController);

// Route to archive a client
router.patch('/:id/archive', authenticate, archiveClientController);

// Route to unarchive a client
router.patch('/:id/unarchive', authenticate, unarchiveClientController);

module.exports = router;
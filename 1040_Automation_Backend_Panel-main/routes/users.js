const express = require('express');
const router = express.Router();
const { createUserController } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/create', authenticate, authorize(['admin']), createUserController);

module.exports = router;

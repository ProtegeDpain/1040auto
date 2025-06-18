const express = require('express');
const router = express.Router();
const { createUserController, getUserController, updateUserController, archiveUserController, unarchiveUserController } = require('../controllers/userController');

router.get('/', getUserController);
router.post('/add', createUserController);
router.put('/:id', updateUserController); // Assuming this is for updating user
router.patch('/:id/archive', archiveUserController);
router.patch('/:id/unarchive', unarchiveUserController);

module.exports = router;

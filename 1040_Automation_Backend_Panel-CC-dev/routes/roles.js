const express = require('express');
const router = express.Router();
const { getRolesController } = require('../controllers/roleController');

router.get('/', getRolesController);

module.exports = router;

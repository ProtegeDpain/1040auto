const express = require('express');
const router = express.Router();
const {
    getSoftwareTypesController,
    addSoftwareTypeController,
    archiveSoftwareTypeController,
    unarchiveSoftwareTypeController,
    getNetworkAccessTypesController,
    addNetworkAccessTypeController,
    archiveNetworkAccessTypeController,
    unarchiveNetworkAccessTypeController
} = require('../controllers/toolController');

// Software Types
router.get('/software-types', getSoftwareTypesController);
router.post('/software-types', addSoftwareTypeController);
router.patch('/software-types/:id/archive', archiveSoftwareTypeController);
router.patch('/software-types/:id/unarchive', unarchiveSoftwareTypeController);

// Network Access Types
router.get('/network-access-types', getNetworkAccessTypesController);
router.post('/network-access-types', addNetworkAccessTypeController);
router.patch('/network-access-types/:id/archive', archiveNetworkAccessTypeController);
router.patch('/network-access-types/:id/unarchive', unarchiveNetworkAccessTypeController);

module.exports = router;

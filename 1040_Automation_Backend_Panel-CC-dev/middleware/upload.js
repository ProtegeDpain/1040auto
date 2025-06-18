// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Use memory storage for direct upload to Azure
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
    fileFilter: (req, file, cb) => {
        // Accept only certain file types if needed
        cb(null, true);
    }
});

module.exports = upload;

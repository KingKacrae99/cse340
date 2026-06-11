// Express Route Target File (e.g., routes/inventoryRoute.js)
const multer = require('multer');
const imgProcessor = require('../utilities/image-processor'); // Adjust relative path syntax

// Store raw byte buffers temporarily inside memory stack frames
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Safety Guard Threshold
});


module.exports = upload;
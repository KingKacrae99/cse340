const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imageProcessor = {};

/**
 * RE-SHAPE AND COMPRESS IMAGES FOR OPTIMIZED SYSTEM STORAGE
 * Processes raw buffers into a standard high-res webp and a compact custom thumbnail
 */
imageProcessor.processVehicleImagery = async (req, res, next) => {
    // If no file binary was processed by multer, move to validation handling in controller
    if (!req.file) {
        return next();
    }

    try {
        const uploadDir = './public/images/vehicles/';
        
        // Ensure destination folder structures exist cleanly on host environment
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate a clean, unique base filename matrix without original extensions
        const timestamp = Date.now();
        const baseName = path.parse(req.file.originalname).name.replace(/\s+/g, '-').toLowerCase();
        const finalFileName = `${timestamp}-${baseName}`;

        // Define exact targets to write down into the database string fields
        const targetHighResPath = `${uploadDir}${finalFileName}.webp`;
        const targetThumbPath = `${uploadDir}${finalFileName}-tn.webp`;

        // 1. Process High-Resolution Clean WebP Showcase Image
        await sharp(req.file.buffer)
            .resize({ width: 1200, height: 750, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(targetHighResPath);

        // 2. Process Compact System Thumbnail Asset Matrix (-tn.webp)
        await sharp(req.file.buffer)
            .resize({ width: 400, height: 250, fit: 'cover' }) // 'cover' crops perfectly to retain structural symmetry
            .webp({ quality: 75 }) // Highly compressed for grid catalog loading efficiency
            .toFile(targetThumbPath);

        // 3. Mount file resolution path tokens onto req.body for your DB queries
        req.body.inv_image = `/images/vehicles/${finalFileName}.webp`;
        req.body.inv_thumbnail = `/images/vehicles/${finalFileName}-tn.webp`;

        next();
    } catch (error) {
        console.error("Critical Image Processing Pipeline Error:", error);
        next(error);
    }
};

module.exports = imageProcessor;
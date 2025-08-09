const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Use environment variable for DB URL (must be set in .env)
if (!process.env.DB_URL) {
    console.warn("DB_URL not found in environment variables. Make sure to set it in production.");
}

const storage = new GridFsStorage({
    url: process.env.DB_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
            return {
                bucketName: "invalid",
                filename: `${Date.now()}-invalid-${file.originalname}`,
            };
        }

        return {
            bucketName: "fooditems", // GridFS collection name
            filename: `${Date.now()}-${file.originalname}`,
        };
    }
});

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Use environment variable for DB URL (must be set in .env)
if (!process.env.DB_URL) {
    console.warn("DB_URL not found in environment variables. Make sure to set it in production.");
}

const storage = new GridFsStorage({
    url: process.env.DB_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(file.mimetype)) {
            return {
                bucketName: "invalid",
                filename: `${Date.now()}-invalid-${file.originalname}`,
            };
        }

        return {
            bucketName: "fooditems", // GridFS collection name
            filename: `${Date.now()}-${file.originalname}`,
        };
    }
});

// Configure multer with file size limits and validation
const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file at a time
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error("Only PNG, JPEG, JPG, and WebP images are allowed");
            error.code = "INVALID_FILE_TYPE";
            return cb(error, false);
        }
        
        // Check file size (additional check)
        if (file.size > 5 * 1024 * 1024) {
            const error = new Error("File size too large. Maximum 5MB allowed");
            error.code = "FILE_TOO_LARGE";
            return cb(error, false);
        }
        
        cb(null, true);
    }
});

// Middleware to handle upload errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: "File too large. Maximum size is 5MB",
                code: "FILE_TOO_LARGE"
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                error: "Too many files. Only one file allowed",
                code: "TOO_MANY_FILES"
            });
        }
    }
    
    if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ 
            error: err.message,
            code: "INVALID_FILE_TYPE"
        });
    }
    
    if (err.code === 'FILE_TOO_LARGE') {
        return res.status(400).json({ 
            error: err.message,
            code: "FILE_TOO_LARGE"
        });
    }
    
    // Generic error
    return res.status(500).json({ 
        error: "File upload failed",
        code: "UPLOAD_ERROR"
    });
};

module.exports = { upload, handleUploadError };


// const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');


// const storage = new GridFsStorage({
//     url: process.env.DB_URL,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];
//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${file.originalname}`;
//             return filename;
//         }

//         return {
//             bucketName: 'fooditems',
//             filename: `${file.originalname}`
//         }
//     }
// });

// module.exports = multer({ storage });
const multer = require("multer");

// Multer configuration for image uploads (profile images)
const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file type - only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
}).single("image"); // Changed from "file" to "image" to match frontend

// Multer configuration for resume uploads (PDF files)
const uploadResume = multer({
  storage: multer.memoryStorage(), // Use memory storage for processing
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file type - only PDFs
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for resumes!"), false);
    }
  },
}).single("file"); // Frontend sends "file" field

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large! Maximum size is 5MB.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: `Unexpected field: ${err.field}. Please check the field name.`,
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error!",
    });
  }
  next();
};

module.exports = {
  uploadFile,
  uploadResume,
  handleMulterError,
};

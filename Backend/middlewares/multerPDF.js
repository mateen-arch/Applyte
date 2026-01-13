const multer = require("multer");

const uploadPDF = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
}).single("file"); // Match frontend field name

// Wrapper middleware for better error handling
const uploadPDFMiddleware = (req, res, next) => {
  uploadPDF(req, res, (err) => {
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
          message: "Unexpected field name. Use 'file' as the field name.",
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
  });
};

module.exports = { uploadPDF, uploadPDFMiddleware };
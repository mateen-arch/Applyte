const multer = require("multer");

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024
  }
}).single("file");

module.exports = { uploadFile };

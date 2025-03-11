const multer = require("multer");

// Configure Multer storage
const storage = multer.diskStorage({}); // No local storage, since we're using Cloudinary

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

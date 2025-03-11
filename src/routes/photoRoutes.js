const express = require("express");
const {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
  updatePhoto,
} = require("../controllers/photoController");
const upload = require("../config/multerConfig"); // Import multer configuration

const photoRoutes = express.Router();

photoRoutes.post("/upload", upload.single("photo"), uploadPhoto); // Ensure the field name is "photo"
photoRoutes.get("/", getPhotos);
photoRoutes.get("/:id", getPhotoById);
photoRoutes.delete("/:id", deletePhoto);
photoRoutes.put("/:id", updatePhoto);

module.exports = photoRoutes;

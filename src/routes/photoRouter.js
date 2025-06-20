const express = require("express");
const {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
  updatePhoto,
  deleteAllPhotos,
} = require("../controllers/photoController");
const upload = require("../config/multerConfig"); // Import multer configuration
const { authMiddleware } = require("../middlewares/authMiddleware");

const photoRouter = express.Router();

photoRouter.post(
  "/upload",
  authMiddleware,
  upload.single("photo"),
  uploadPhoto
); // Ensure the field name is "photo"
photoRouter.get("/", getPhotos);
photoRouter.get("/:id", getPhotoById);
photoRouter.delete("/:id", authMiddleware, deletePhoto);
photoRouter.delete("/", authMiddleware, deleteAllPhotos);
photoRouter.put("/:id", authMiddleware, upload.single("photo"), updatePhoto);

module.exports = photoRouter;

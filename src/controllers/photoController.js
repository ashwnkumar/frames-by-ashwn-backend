const { cloudinary } = require("../config/cloudinary");
const Photo = require("../models/photoModel");
const { sendResponse } = require("../utils/sendResponse");

const uploadPhoto = async (req, res) => {
  try {
    const { title, description, album } = req.body;
    console.log("req.file from add", req.file);

    if (!req.file) {
      return sendResponse(res, 400, "Photo is required");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "frames-by-ashwn",
      use_filename: true,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      eager: [
        { width: 500, quality: "auto", fetch_format: "auto" }, // Preview Image
      ],
    });

    const image = {
      fullSizeUrl: result.secure_url, // Original Image
      previewUrl: result.eager[0].secure_url, // Optimized Preview Image
    };

    // Save `image.fullSizeUrl` and `image.previewUrl` in your database

    const uploadedPhoto = new Photo({
      title,
      description,
      imageUrl: result.secure_url, // Original Image
      previewUrl: result.eager[0].secure_url, // Optimized Preview Image
      album,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      aspectRatio: result.width / result.height,
    });

    await uploadedPhoto.save();
    sendResponse(res, 201, "Photo uploaded", { uploadedPhoto });
  } catch (error) {
    sendResponse(res, 500, "Error uploading photo", { error: error.message });
    console.error("Error uploading photo", error);
  }
};

const getPhotos = async (req, res) => {
  try {
    const photo = await Photo.find().sort({ createdAt: -1 });
    sendResponse(res, 200, "Photos fetched", { photos: photo });
  } catch (error) {
    sendResponse(res, 500, "Error fetching photos", { error: error.message });
    console.error("Error fetching photos", error);
  }
};

const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found");
    }
    sendResponse(res, 200, "Photo fetched", { photo });
  } catch (error) {
    sendResponse(res, 500, "Error fetching photo", { error: error.message });
    console.error("Error fetching photo", error);
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found");
    }

    await cloudinary.uploader.destroy(photo.publicId);

    await photo.deleteOne();
    sendResponse(res, 200, "Photo deleted");
  } catch (error) {
    sendResponse(res, 500, "Error deleting photo", { error: error.message });
    console.error("Error deleting photo", error);
  }
};

const updatePhoto = async (req, res) => {
  try {
    console.log("req from update", req.body);
    console.log("req from update", req.file);
    const { title, description, category } = req.body;
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found");
    }

    if (req.file) {
      await cloudinary.uploader.destroy(photo.publicId);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "frames-by-ashwn",
        use_filename: true,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
        eager: [
          { width: 500, quality: "auto", fetch_format: "auto" }, // Preview Image
        ],
      });

      console.log("result from update", result);

      photo.imageUrl = result.secure_url;
      photo.publicId = result.public_id;
      photo.width = result.width;
      photo.height = result.height;
      photo.aspectRatio = result.width / result.height;
      photo.previewUrl = result.eager[0].secure_url;
    }

    photo.title = title || photo.title;
    photo.description = description || photo.description;
    photo.category = category || photo.category;

    console.log("photo after save", photo);

    await photo.save();
    sendResponse(res, 200, "Photo updated", { photo });
  } catch (error) {
    sendResponse(res, 500, "Error updating photo", { error: error.message });
    console.error("Error updating photo", error);
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
  updatePhoto,
};
